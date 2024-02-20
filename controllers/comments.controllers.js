
const { selectArticleById } = require("../models/articles.models");
const { selectCommentsByArticleId } = require("../models/comments.models");

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