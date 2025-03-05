const { ObjectId } = require('mongodb')
const connection = require("./dbconnection.js")
const msgBoardDatabase = connection.run();

const createThread = async (threadData) => {
    const db = await msgBoardDatabase;
    threadData.created_on = new Date().toISOString();
    threadData.bumped_on = new Date().toISOString();
    return await db.collection("threads").insertOne(threadData);
};

const getBoard = async (board) => {
    const db = await msgBoardDatabase;
    const threads = await db.collection("threads").find({ board: board }).sort({ bumped_on: -1 }).toArray();
    const threadsWithReplies = await Promise.all(threads.map(async thread => {
        const threadReplies = await db.collection("replies").find({ thread_id: thread._id }, { replies: { $slice: -3 } }).toArray();
        thread.replies = threadReplies;
        thread.replycount = threadReplies.length;
        return thread;
    }));
    return threadsWithReplies;
};

const getThreadById = async (threadId) => {
    const db = await msgBoardDatabase;
    const thread = await db.collection("threads").findOne({ _id: ObjectId.createFromHexString(threadId) });
    const threadReplies = await db.collection("replies").find({ thread_id: ObjectId.createFromHexString(threadId) }).toArray();
    thread.replies = threadReplies
    return thread;
};

const deleteThreadById = async (deleteData) => {
    const { thread_id, delete_password } = deleteData;
    const db = await msgBoardDatabase;
    return await db.collection("threads").deleteOne({ _id: ObjectId.createFromHexString(thread_id), delete_password: delete_password });
};

const addReply = async (replyData) => {
    const db = await msgBoardDatabase;
    const replyInfo = {
        thread_id: ObjectId.createFromHexString(replyData.thread_id),
        created_on: new Date().toISOString(),
        text: replyData.text,
        delete_password: replyData.delete_password
    }
    return await db.collection("replies").insertOne(replyInfo);
};

const deleteReplyById = async (deleteData) => {
    const db = await msgBoardDatabase;
    const { reply_id, delete_password } = deleteData;
    return await db.collection("replies").deleteOne({ _id: ObjectId.createFromHexString(reply_id), delete_password: delete_password });
};

module.exports = { createThread, getBoard, addReply, getThreadById, deleteThreadById, deleteReplyById }