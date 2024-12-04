import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { readFile } from 'fs/promises';


export const blockService = {
	getByType,
	update,
}

async function getByType(blockType) {
	try {
		if (blockType === null || blockType === 'null') return null
		const criteria = { type: blockType }
		const collection = await dbService.getCollection('block')
		let block = await collection.findOne(criteria)
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

async function _createData() {
	const data = JSON.parse(await readFile(new URL('./data.json', import.meta.url), 'utf-8'));
	const collection = await dbService.getCollection('block')
	await collection.insertMany(data)
}