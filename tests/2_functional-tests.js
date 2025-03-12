const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const queriesForTests = require("../database/queriesForTests")

chai.use(chaiHttp);

suite('Functional Tests', function () {
    test("Creating a new thread: POST request to /api/threads/{board}", function (done) {
        chai.request(server).post("/api/threads/testBoard").send({ board: "testBoard", text: "test", delete_password: "test" }).then(res => {
            assert.equal(res.statusCode, 200, "Response Status Code is 200");
            queriesForTests.getThreadByBoardName("testBoard").then(dbResult => {
                assert.equal(dbResult.board, "testBoard", "Thread has been created");
                done();
            });
        });
    });

    test("Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}", function (done) {
        chai.request(server).get("/api/threads/testBoard").then(res => {
            assert.equal(res.statusCode, 200, "Response Status Code is 200");
            assert.isOk(res.body.length < 11, "Threads showed never exceed 10")
            res.body.forEach(thread => {
                assert.isOk(thread.replies.length < 4, "Replies showed never exceed 3")
            })
            done();
        });
    });

    test("Deleting a thread with the correct password: DELETE request to /api/threads/{board} with an valid delete_password", function (done) {
        queriesForTests.getThreadByBoardName("testBoard").then(dbResult => {
            chai.request(server).delete("/api/threads/testBoard").send({ thread_id: dbResult._id, delete_password: dbResult.delete_password }).then(res => {
                assert.equal(res.statusCode, 200, "Response Status Code is 200");
                assert.equal(res.text, "success", "Response is success");
                done();
            });
        })
    });
});
