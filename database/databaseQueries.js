const { ObjectId } = require('mongodb')
const connection = require("./dbconnection.js")
const msgBoardDatabase = connection.run();

const createThread = async (threadData) => {
    const db = await msgBoardDatabase;
    threadData.created_on = new Date().toISOString();
    threadData.bumped_on = new Date().toISOString();
    threadData.replies = [];
    threadData.replycount = 0;
    return await db.collection("threads").insertOne(threadData);
};

const getBoard = async (board) => {
    const db = await msgBoardDatabase;
    return await db.collection("threads").find({ board: board }, { replies: { $slice: -3 } }).sort({ bumped_on: -1 }).toArray();
};

const getThreadById = async (threadId) => {
    const db = await msgBoardDatabase;
    return await db.collection("threads").findOne({ _id: ObjectId.createFromHexString(threadId) });
};

const deleteThreadById = async (deleteData) => {
    const { thread_id, delete_password } = deleteData;
    const db = await msgBoardDatabase;
    return await db.collection("threads").deleteOne({ _id: ObjectId.createFromHexString(thread_id), delete_password: delete_password });
};

const addReply = async (replyData) => {
    const db = await msgBoardDatabase;
    const query = { _id: ObjectId.createFromHexString(replyData.thread_id) }
    const replyInfo = {
        created_on: new Date().toISOString(),
        text: replyData.text,
        delete_password: replyData.delete_password
    }
    const update = { $inc: { replycount: 1 }, $push: { replies: replyInfo } }
    return await db.collection("threads").updateOne(query, update);
};

module.exports = { createThread, getBoard, addReply, getThreadById, deleteThreadById }