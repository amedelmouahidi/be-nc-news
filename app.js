const cors = require('cors');
const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/api.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  getArticleById,
  getArticles,
  patchArticle
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment
} = require("./controllers/comments.controllers");
const {
  serverErrors,
  customErrors,
  psqlErrors
} = require("./controllers/errors.controllers");


const app = express();

app.use(cors());


app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch('/api/articles/:article_id', patchArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.get('/api/users', getUsers)




app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

module.exports = app;
