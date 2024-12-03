import express from 'express'

import { getBlockByType, updateBlock } from './block.controller.js'

const router = express.Router()

router.get('/:type', getBlockByType)
router.put('/', updateBlock)

export const blockRoutes = router