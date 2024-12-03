import { logger } from '../../services/logger.service.js'
import { blockService } from './block.service.js'

export async function getBlockByType(req, res) {
	try {
		const blockType = req.params.type
		const block = await blockService.getByType(blockType)
		res.json(block)
	} catch (err) {
		logger.error('Failed to get block', err)
		res.status(400).send({ err: 'Failed to get block' })
	}
}

export async function updateBlock(req, res) {
	const { body: block } = req
	try {
		const updatedBlock = await blockService.update(block)
		res.json(updatedBlock)
	} catch (err) {
		logger.error('Failed to update block', err)
		res.status(400).send({ err: 'Failed to update block' })
	}
}
