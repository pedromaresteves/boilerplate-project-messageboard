const databaseQueries = require("../database/databaseQueries");

module.exports = {
    addReply: async (req, res) => {
        const replyData = {
            created_on: new Date(),
            text: req.body.text,
            delete_password: req.body.delete_password,
            reported: false
        }   
        await databaseQueries.addReply(req.body, replyData);
        const thread = await databaseQueries.getThreadById(req.body.thread_id);
        return res.redirect(`/b/${thread.board}/${req.body.thread_id}`)
    },
    getFullThread: async (req, res) => {
        const thread = await databaseQueries.getThreadById(req.query.thread_id);
        const {reported, delete_password, ...threadForClient} = thread;
        threadForClient.replies = threadForClient.replies.map(reply => {
            const {reported, delete_password, ...replyForClient} = reply;
            return replyForClient;
        });
        return res.send(threadForClient)
    },
    reportReply: async (req, res) => {
        const threadID = req.body.thread_id;
        const replyID = req.body.reply_id;
        await databaseQueries.reportReply(threadID, replyID);
        return res.send("reported");
    },
    deleteReply: async (req, res) => {
        const deleteFeedback = await databaseQueries.deleteReplyById(req.body)
        const msgToClient = deleteFeedback ? "success" : "incorrect password"
        return res.send(msgToClient)
    },
}