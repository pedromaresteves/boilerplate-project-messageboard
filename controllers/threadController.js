const databaseQueries = require("../database/databaseQueries");

module.exports = {
    getThreadsByBoard: async (req, res) => {
        const data = await databaseQueries.getBoard(req.params.board)
        return res.send(data);
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