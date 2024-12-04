import express from 'express'

import { getBlockByType, updateBlock } from './block.controller.js'

// Defines routes using respective controller functions.

const router = express.Router()

router.get('/:type', getBlockByType)
router.put('/', updateBlock)

export const blockRoutes = router