const { selectArticleById, selectArticles, updateArticle } = require("../models/articles.models");

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

exports.patchArticle = (req, res, next) => {
  const {article_id} = req.params
  const {body} = req
  updateArticle(article_id, body).then((article) => {
    res.status(200).send({article})
  }).catch(next)
}

