import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { readFile } from 'fs/promises';

export const blockService = {
	getByType,
	update,
}

// Retrieves a block by its type, creates data if not found.
async function getByType(blockType) {
	try {
		// If blockType is invalid, return null
		if (blockType === null || blockType === 'null') return null
		const criteria = { type: blockType }
		const collection = await dbService.getCollection('block')
		let block = await collection.findOne(criteria)

		// If block doesn't exist, create the data and retry
		if (!block) {
			await _createData()
			block = await collection.findOne(criteria)
		}
		return block
	} catch (err) {
		logger.error(`while finding block ${blockType}`, err)
		throw err
	}
}

// Updates a block's information in the database.
async function update(block) {
	const blockToSave = { ...block }
	delete blockToSave._id // Remove _id for update operation
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

// Helper function to create initial block data if not present in the database.
async function _createData() {
	const data = JSON.parse(await readFile(new URL('../../data/block.data.json', import.meta.url), 'utf-8'));
	const collection = await dbService.getCollection('block')
	await collection.insertMany(data)
}