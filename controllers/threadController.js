const { reporters } = require("mocha");
const databaseQueries = require("../database/databaseQueries");

module.exports = {
    getThreadsByBoard: async (req, res) => {
        const data = await databaseQueries.getBoard(req.params.board);
        const threadsWithFilteredReplies = data.map(document => {
            const {reported, delete_password , ...newDoc} = document;            
            newDoc.replies = document.replies.slice(-3);
            newDoc.replies = newDoc.replies.map(reply => {
                const {delete_password, reported, ...goodReply} = reply;
                return goodReply;
            });
            newDoc.replycount = document.replies.length;
            return newDoc;
        });
        return res.send(threadsWithFilteredReplies);
    },
    createThread: async (req, res) => {
        let boardName = req.body.board;
        if(!req.body.board) boardName = req.params.board
        const threadData = {
            board : boardName,
            text: req.body.text,
            delete_password: req.body.delete_password,
            created_on: new Date(),
            bumped_on: new Date(),
            replies : [],
            reported : false
        }
        await databaseQueries.createThread(threadData)
        return res.redirect(`/b/${req.body.board}/`)
    },
    reportThread: async (req, res) => {
        const threadID = req.body.thread_id;
        await databaseQueries.reportThread(threadID);
        return res.send("reported");
    },
    deleteThreadData: async (req, res) => {
        const databaseDeleteFeedback = await databaseQueries.deleteThreadById(req.body)
        const msgToClient = databaseDeleteFeedback.deletedCount ? "success" : "incorrect password"
        return res.send(msgToClient)
    }
}