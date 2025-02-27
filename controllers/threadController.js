const databaseQueries = require("../database/databaseQueries");

module.exports = {
    getThreadsByBoard: async (req, res) => {
        const data = await databaseQueries.getBoard(req.params.board)
        const dataWithOnly3Replies = data.map((document) => {
            document.replies = document.replies.slice(-3);
            return document;
        })
        return res.send(dataWithOnly3Replies);
    },
    createThread: async (req, res) => {
        await databaseQueries.createThread(req.body)
        return res.redirect(`/b/${req.body.board}/`)
    },
    putThreadData: async (req, res) => {
        //pending
    },
    deleteThreadData: async (req, res) => {
        const databaseDeleteFeedback = await databaseQueries.deleteThreadById(req.body)
        const msgToClient = databaseDeleteFeedback.deletedCount ? "success" : "incorrect password"
        return res.send(msgToClient)
    }
}