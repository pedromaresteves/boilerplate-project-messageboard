const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.dbConnectionString;
let msgBoardDb;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run(db = "msg_board") {
    if (msgBoardDb) {
        return msgBoardDb;
    }
    try {
        await client.connect();
        msgBoardDb = await client.db(db)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return msgBoardDb;
    } catch (error) {
        console.log(error)
    }
}

const cleanup = async () => {
    console.log("Clean up time")
    await client.close();
    process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = { run };