const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId, limit=10, page=1) => {
  const offset = (page-1)*limit
  return db
  .query(
    `SELECT * FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3`,
    [articleId, limit, offset]
  )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (articleId, comment) => {
  const { username, body } = comment;
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return db
        .query(
          `INSERT INTO comments (
          body, votes, author, article_id)
          VALUES
          ($1, 0, $2, $3) RETURNING *;`,
          [body, username, articleId]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.removeComment = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};


