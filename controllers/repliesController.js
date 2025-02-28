const databaseQueries = require("../database/databaseQueries");

module.exports = {
    addReply: async (req, res) => {
        await databaseQueries.addReply(req.body);
        const thread = await databaseQueries.getThreadById(req.body.thread_id);
        return res.redirect(`/b/${thread.board}/${req.body.thread_id}`)
    },
    getFullThread: async (req, res) => {
        const thread = await databaseQueries.getThreadById(req.query.thread_id);
        return res.send(thread)
    }
}