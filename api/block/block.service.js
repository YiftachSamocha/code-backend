import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const blockService = {
	remove,
	query,
	getById,
	add,
	update,
	addBlockMsg,
	removeBlockMsg,
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

async function getById(blockId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(blockId) }

		const collection = await dbService.getCollection('block')
		const block = await collection.findOne(criteria)
        
		block.createdAt = block._id.getTimestamp()
		return block
	} catch (err) {
		logger.error(`while finding block ${blockId}`, err)
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
        if(!isAdmin) criteria['owner._id'] = ownerId
        
		const collection = await dbService.getCollection('block')
		const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw('Not your block')
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
    const blockToSave = { vendor: block.vendor, speed: block.speed }

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

async function addBlockMsg(blockId, msg) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(blockId) }
        msg.id = makeId()
        
		const collection = await dbService.getCollection('block')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add block msg ${blockId}`, err)
		throw err
	}
}

async function removeBlockMsg(blockId, msgId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(blockId) }

		const collection = await dbService.getCollection('block')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})
        
		return msgId
	} catch (err) {
		logger.error(`cannot add block msg ${blockId}`, err)
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
    if(!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}