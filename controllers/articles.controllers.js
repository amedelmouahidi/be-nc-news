const { selectArticleById, selectArticles, insertComment } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {topic, sort_by, order} = req.query
  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const {article_id} = req.params
  const {body} = req
  insertComment(article_id, body).then((comment) => {
    res.status(201).send({comment})
  }).catch(next)
}
