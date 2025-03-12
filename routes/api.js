'use strict';
const threadController = require('../controllers/threadController')
const repliesController = require('../controllers/repliesController')

module.exports = function (app) {

  app.route('/api/threads/:board').get((req, res, next) => {
    return threadController.getThreadsByBoard(req, res, next);
  }).post((req, res, next) => {
    return threadController.createThread(req, res, next)
  }).put((req,res,next) => threadController.reportThread(req,res,next)).delete((req, res, next) => {
    return threadController.deleteThreadData(req, res, next)
  });

  app.route('/api/replies/:board').get((req, res, next) => {
    return repliesController.getFullThread(req, res, next);
  }).post((req, res, next) => {
    return repliesController.addReply(req, res, next);
  }).put((req, res, next) => repliesController.reportReply(req,res,next)).delete((req, res, next) => {
    return repliesController.deleteReply(req, res, next)
  });;

};
