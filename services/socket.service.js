import { logger } from './logger.service.js'
import { Server } from 'socket.io'

var gIo = null

// Initializes the socket server and sets up event listeners.
export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*', 
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)

        // Assign first socket as mentor if no mentor is present
        if (gIo.sockets.sockets.size === 1 && !socket.isMentor) socket.isMentor = true
        var mentorSocket = Array.from(gIo.sockets.sockets.values()).find(sock => sock.isMentor)
        gIo.emit('set-users-amount', gIo.sockets.sockets.size) // Emit user count to all clients

        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
            gIo.emit('set-users-amount', gIo.sockets.sockets.size) // Update user count on disconnect
        })

        // Handles block type changes and room joining
        socket.on('get-block-type', type => {
            if (socket.blockType) socket.leave(socket.blockType); // Leave previous blockType room

            const isMentor = socket.id === mentorSocket.id;
            const mentorBlockType = mentorSocket.blockType;
            let isBadConnection = false;

            // Set blockType based on user role and type
            if (isMentor) {
                socket.blockType = type;
            } else if (type && type !== mentorBlockType) {
                socket.blockType = null;
                isBadConnection = true;
            } else {
                socket.blockType = type;
            }

            // Join new blockType room
            if (socket.blockType) socket.join(socket.blockType);

            // Notify mentor or user about block type changes
            if (isMentor) {
                logger.info(`Socket id (mentor): ${socket.id} block type is ${type}`)
                gIo.emit('set-block-type', type);
            } else {
                logger.info(`Socket id: ${socket.id} block type is ${mentorBlockType}`)
                socket.emit('set-block-type', mentorBlockType);
            }

            // Handle bad connection- if the user tried to enter a block that is not the mentor's block
            if (isBadConnection) {
                socket.emit('bad-connection', mentorBlockType)
            }
        })

        // Emits current user info (id and mentor status)
        socket.on('get-curr-user', () => {
            logger.info(`Get curr user socket: ${socket.id}`)
            socket.emit('set-curr-user', { id: socket.id, isMentor: socket.isMentor })
        })

        // Emits the current number of connected users
        socket.on('get-users-amount', () => {
            logger.info(`Get users amount: ${gIo.sockets.sockets.size}`)
            socket.emit('set-users-amount', gIo.sockets.sockets.size)
        })

        // Broadcasts block edits to relevant clients
        socket.on('edit-block', content => {
            logger.info(`Socket [id: ${socket.id}] edited block type ${socket.blockType}`)
            _broadcast('block-edited', content, socket.blockType, socket.id)
        })

        // Forwards the question from user to mentor
        socket.on('send-question', question => {
            logger.info(`Socket [id: ${socket.id}] asked question: ${question.content}`)
            if (mentorSocket) {
                mentorSocket.emit('get-question', { ...question, userId: socket.id })
            }
        })

        // Forwards the answer from mentor to the user
        socket.on('send-answer', answer => {
            logger.info(`Socket [id: ${socket.id}] (mentor) answered a question: ${answer.content}`)
            _emitToUser('get-answer', answer, answer.askerId)
        })
    })
}

// Emits data to a specific user based on userId
async function _emitToUser(type, data, userId) {
    console.log(type, data, userId)
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emitting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
    }
}

// Retrieves a socket instance for a specific user by their ID
async function _getUserSocket(id) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.id === id)
    return socket
}

// Fetches all active socket instances
async function _getAllSockets() {
    const sockets = await gIo.fetchSockets()
    return sockets
}

// Broadcasts data to all users or a specific room, excluding a user if needed
async function _broadcast(type, data, room = null, userId) {
    userId = userId.toString()

    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

export const socketService = {
    setupSocketAPI,
}
