import { logger } from '../../services/logger.service.js'
import { blockService } from './block.service.js'

export async function getBlocks(req, res) {
	try {
		const filterBy = {
			txt: req.query.txt || '',
		}
		const blocks = await blockService.query(filterBy)
		res.json(blocks)
	} catch (err) {
		logger.error('Failed to get blocks', err)
		res.status(400).send({ err: 'Failed to get blocks' })
	}
}

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

export async function addBlock(req, res) {
	const { loggedinUser, body: block } = req

	try {
		block.owner = loggedinUser
		const addedBlock = await blockService.add(block)
		res.json(addedBlock)
	} catch (err) {
		logger.error('Failed to add block', err)
		res.status(400).send({ err: 'Failed to add block' })
	}
}

export async function updateBlock(req, res) {
	const { body: block } = req
	// const { _id: userId, isAdmin } = loggedinUser

	// if(!isAdmin && block.owner._id !== userId) {
	//     res.status(403).send('Not your block...')
	//     return
	// }

	try {
		const updatedBlock = await blockService.update(block)
		res.json(updatedBlock)
	} catch (err) {
		logger.error('Failed to update block', err)
		res.status(400).send({ err: 'Failed to update block' })
	}
}

export async function removeBlock(req, res) {
	try {
		const blockId = req.params.id
		const removedId = await blockService.remove(blockId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove block', err)
		res.status(400).send({ err: 'Failed to remove block' })
	}
}

export async function addBlockMsg(req, res) {
	const { loggedinUser } = req

	try {
		const blockId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await blockService.addBlockMsg(blockId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update block', err)
		res.status(400).send({ err: 'Failed to update block' })
	}
}

export async function removeBlockMsg(req, res) {
	try {
		const blockId = req.params.id
		const { msgId } = req.params

		const removedId = await blockService.removeBlockMsg(blockId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove block msg', err)
		res.status(400).send({ err: 'Failed to remove block msg' })
	}
}
