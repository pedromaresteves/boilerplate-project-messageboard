const connection = require("./dbconnection.js")
const msgBoardDatabase = connection.run();

const getThreadByBoardName = async (boardName) => {
    const db = await msgBoardDatabase;
    const dbResult = await db.collection("threads").findOne({ board: boardName });
    return dbResult;
};

const clearDB = async () => {
    const db = await msgBoardDatabase;
    await db.collection("replies").drop();
    await db.collection("threads").drop();
    return;
}

module.exports = { getThreadByBoardName, clearDB }