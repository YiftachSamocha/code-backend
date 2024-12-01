import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getBlocks, getBlockById, addBlock, updateBlock, removeBlock, addBlockMsg, removeBlockMsg } from './block.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', getBlocks)
router.get('/:id', getBlockById)
router.post('/', addBlock)
router.put('/:id', updateBlock)
router.delete('/:id', removeBlock)
// router.delete('/:id', requireAuth, requireAdmin, removeBlock)

router.post('/:id/msg', requireAuth, addBlockMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeBlockMsg)

export const blockRoutes = router