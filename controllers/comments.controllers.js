
const { selectArticleById } = require("../models/articles.models");
const { selectCommentsByArticleId, addComment } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then((returnedPromises) => {
      res.status(200).send({ comments: returnedPromises[1] });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const {article_id} = req.params
  const {body} = req
  addComment(article_id, body).then((comment) => {
    res.status(201).send({comment})
  }).catch(next)
}