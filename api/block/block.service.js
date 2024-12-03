import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { createData } from '../../services/block.data.js'

export const blockService = {
	getByType,
	add,
	update,
}

async function getByType(blockType) {
	try {
		if (blockType === null || blockType === 'null') return null
		const criteria = { type: blockType }
		const collection = await dbService.getCollection('block')
		let block = await collection.findOne(criteria)
		if (!block) {
			const newBlock = createData(blockType)
			block = await add(newBlock)
		}
		return block
	} catch (err) {
		logger.error(`while finding block ${blockType}`, err)
		throw err
	}
}

async function update(block) {
	const blockToSave = { ...block }
	delete blockToSave._id
	console.log(block)
	try {
		const criteria = { _id: ObjectId.createFromHexString(block._id) }
		const collection = await dbService.getCollection('block')
		await collection.updateOne(criteria, { $set: blockToSave })
		return block
	} catch (err) {
		logger.error(`cannot update block ${block._id}`, err)
		throw err
	}
}

async function add(block) {
	try {
		const collection = await dbService.getCollection('block')
		await collection.insertOne(block)
		return block
	} catch (err) {
		logger.error('cannot insert block', err)
		throw err
	}
}