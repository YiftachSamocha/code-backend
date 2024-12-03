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
        const mentorSocket = Array.from(gIo.sockets.sockets.values()).find(sock => sock.isMentor)
        if (mentorSocket) socket.emit('block-type-chosen', mentorSocket.blockType)
        gIo.emit('set-users-amount', gIo.sockets.sockets.size)

        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
            gIo.emit('set-users-amount', gIo.sockets.sockets.size)
        })

        socket.on('set-block-type', blockType => {
            if (socket.blockType === blockType) return
            if (socket.blockType) {
                socket.leave(socket.blockType)
                logger.info(`Socket is leaving block type ${socket.blockType} [id: ${socket.id}]`)
            }
            socket.join(blockType)
            socket.blockType = blockType
            logger.info(`Socket is joining block type ${socket.blockType} [id: ${socket.id}]`)
            gIo.emit('block-type-chosen', blockType)
        })

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
            console.log(answer)
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
