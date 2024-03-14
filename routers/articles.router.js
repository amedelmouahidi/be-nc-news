const {
  getArticles,
  getArticleById,
  patchArticle,
  postArticle,
  deleteArticle,
} = require("../controllers/articles.controllers");
const { getCommentsByArticleId, addComment } = require("../controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticle)
.delete(deleteArticle);


articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(addComment);

module.exports = articlesRouter