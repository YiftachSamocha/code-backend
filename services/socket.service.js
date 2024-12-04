import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        if (gIo.sockets.sockets.size === 1 && !socket.isMentor) socket.isMentor = true
        socket.emit('set-curr-user', { id: socket.id, isMentor: socket.isMentor })
        var mentorSocket = Array.from(gIo.sockets.sockets.values()).find(sock => sock.isMentor)
        gIo.emit('set-users-amount', gIo.sockets.sockets.size)

        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
            gIo.emit('set-users-amount', gIo.sockets.sockets.size)
        })

        socket.on('get-block-type', type => {
            // Leave the previous blockType room if it exists
            if (socket.blockType) socket.leave(socket.blockType);

            // Initialize variables
            const isMentor = socket.id === mentorSocket.id;
            const mentorBlockType = mentorSocket.blockType;
            let isBadConnection = false;

            // Determine the blockType for the socket
            if (isMentor) {
                socket.blockType = type;
            } else if (type && type !== mentorBlockType) {
                socket.blockType = null;
                isBadConnection = true;
            } else {
                socket.blockType = type;
            }

            // Join the new blockType room
            if (socket.blockType) socket.join(socket.blockType);

            // Emit block type changes
            if (isMentor) {
                gIo.emit('set-block-type', type);
            } else {
                socket.emit('set-block-type', mentorBlockType);
            }

            // Handle bad user connection
            if (isBadConnection) {
                socket.emit('set-curr-user', { id: socket.id, isMentor: socket.isMentor });
                socket.emit('set-users-amount', gIo.sockets.sockets.size);
                socket.emit('bad-connection', mentorBlockType)
            }
        });

        socket.on('edit-block', content => {
            logger.info(`Socket [id: ${socket.id}] edited block type ${socket.blockType}`)
            gIo.to(socket.blockType).emit('block-edited', content)
        })

        socket.on('send-question', question => {
            logger.info(`Socket [id: ${socket.id}] asked question: ${question.content}`)
            if (mentorSocket) {
                mentorSocket.emit('get-question', { ...question, userId: socket.id })
            }
        })

        socket.on('send-answer', answer => {
            logger.info(`Socket [id: ${socket.id}] (mentor) answered a question: ${answer.content}`)
            _emitToUser('get-answer', answer, answer.askerId)

        })



    })
}

async function _emitToUser(type, data, userId) {
    console.log(type, data, userId)
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
    }
}

async function _getUserSocket(id) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.id === id)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}


export const socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
}
