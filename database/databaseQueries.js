const { ObjectId } = require('mongodb')
const connection = require("./dbconnection.js")
const msgBoardDatabase = connection.run();

const createThread = async (threadData) => {
    const db = await msgBoardDatabase;
    return await db.collection("threads").insertOne(threadData);
};

const getBoard = async (board) => {
    const db = await msgBoardDatabase;
    const threads = await db.collection("threads").find({ board: board }, { limit: 10 }).sort({ bumped_on: -1 }).toArray();
    return threads;
};

const getThreadById = async (threadId) => {
    const db = await msgBoardDatabase;
    const thread = await db.collection("threads").findOne({ _id: ObjectId.createFromHexString(threadId) });
    return thread;
};

const reportThread = async(id) => {
    const db = await msgBoardDatabase;
    return await db.collection("threads").updateOne({ _id: ObjectId.createFromHexString(id) }, {$set: {reported: true}});
};

const reportReply = async(threadID, replyID) => {
    const db = await msgBoardDatabase;
    const thread = await db.collection("threads").findOne({ _id: ObjectId.createFromHexString(threadID) });
    thread.replies = thread.replies.map(reply => {
        if(reply._id === replyID){
            reply.reported = true;
        };
        return reply;
    });
    return await db.collection("threads").updateOne({ _id: ObjectId.createFromHexString(threadID) }, {$set: {replies: thread.replies}});
};

const deleteThreadById = async (deleteData) => {
    const { thread_id, delete_password } = deleteData;
    const db = await msgBoardDatabase;
    return await db.collection("threads").deleteOne({ _id: ObjectId.createFromHexString(thread_id), delete_password: delete_password });
};

const addReply = async (replyData) => {
    const db = await msgBoardDatabase;
    const replyInfo = {
        _id: new ObjectId(),
        thread_id: ObjectId.createFromHexString(replyData.thread_id),
        created_on: new Date(),
        text: replyData.text,
        delete_password: replyData.delete_password,
        reported: false
    }   
    const replyToDB = await db.collection("threads").updateOne({_id: replyInfo.thread_id}, {$push: {replies: replyInfo}, $set: {bumped_on: new Date()}})
    return replyToDB;
};

const deleteReplyById = async (deleteData) => {
    const db = await msgBoardDatabase;
    const { thread_id, reply_id, delete_password } = deleteData;
    const document = await db.collection("threads").findOne({_id: ObjectId.createFromHexString(thread_id)});
    let successfulDeletion = false;
    document.replies.forEach(item => {
        const idMatch = item._id.toString() === reply_id;
        const passwordMatch = idMatch && item.delete_password === delete_password;
        const match = idMatch && passwordMatch;
        if(match) {
            item.text = "[deleted]";
            successfulDeletion = true;
        }
    });
    await db.collection("threads").updateOne({ _id: ObjectId.createFromHexString(thread_id)}, {$set: {replies : document.replies}});
    return successfulDeletion;
};

module.exports = { createThread, getBoard, addReply, reportThread, reportReply, getThreadById, deleteThreadById, deleteReplyById }