import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import { createData } from '../../services/block.data.js'

const PAGE_SIZE = 3

export const blockService = {
	remove,
	query,
	getByType,
	add,
	update,
}

async function query(filterBy = { txt: '' }) {
	try {
		const criteria = _buildCriteria(filterBy)
		const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('block')
		var blockCursor = await collection.find(criteria, { sort })

		if (filterBy.pageIdx !== undefined) {
			blockCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		}

		const blocks = blockCursor.toArray()
		return blocks
	} catch (err) {
		logger.error('cannot find blocks', err)
		throw err
	}
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

async function remove(blockId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(blockId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('block')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your block')
		return blockId
	} catch (err) {
		logger.error(`cannot remove block ${blockId}`, err)
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




function _buildCriteria(filterBy) {
	const criteria = {
		vendor: { $regex: filterBy.txt, $options: 'i' },
		speed: { $gte: filterBy.minSpeed },
	}

	return criteria
}

function _buildSort(filterBy) {
	if (!filterBy.sortField) return {}
	return { [filterBy.sortField]: filterBy.sortDir }
}