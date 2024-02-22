const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("should get 200, responds with an array of topic objects with slug and desciption as properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("Verify error handling functionality", () => {
  test("should get 404, responds with the correct status code and error message when accessing invalid path", () => {
    return request(app)
      .get("/topics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});
describe("/api", () => {
  test("should return an object describing all the available endpoints on our API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        for (let key in endpoints) {
          expect(endpoints[key]).toHaveProperty("description");
          expect(endpoints[key]).toHaveProperty("queries");
          expect(endpoints[key]).toHaveProperty("exampleResponse");
          if (["POST", "PATCH", "DELETE"].includes(key)) {
            expect(endpoints[key]).toHaveProperty("bodyFormat");
          }
        }
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("should respond with an article object for the specified article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  test("should respond with 400 status code when requesting an invalid ID article", () => {
    return request(app)
      .get("/api/articles/monalisa")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("should respond with 404 status code when requesting a not existing ID article", () => {
    return request(app)
      .get("/api/articles/1503")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("should respond with an article object including comment_count property", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });
});
describe("/api/articles", () => {
  test("should respond with an array of all articles except body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
      });
  });
  test("should respond with articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe("topic query", () => {
    test("should respond with an array that filters the articles by the topic value specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("should respond with all articles if the query is omitted", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("should respond with 404 when given an invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=monalisa")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET requests", () => {
    test("should respond with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(2);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          });
        });
    });
    test("should respond with most recent comments first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("should respond with an empty array when given existing article ID that has no comments", () => {
      return request(app)
        .get("/api/articles/10/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
        });
    });
    test("should respond with 400 when given invalid article ID", () => {
      return request(app)
        .get("/api/articles/monalisa/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 404 when given unexisting article ID", () => {
      return request(app)
        .get("/api/articles/1797/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
  describe("POST requests", () => {
    test("should respond with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body: "monalisa",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("should responds with 400 when given comment with missing properties", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          body: "monalisa",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 400 when given comment with invalid properties", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          username: "monet",
          body: 1840,
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 400 when given invalid article ID", () => {
      return request(app)
        .get("/api/articles/seventy/comments")
        .send({
          username: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 404 when given unexisting article ID", () => {
      return request(app)
        .post("/api/articles/1797/comments")
        .send({
          username: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
  describe("PATCH requests", () => {
    test("should respond with updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 30 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 130,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("should respond with 400 when given invalid article ID", () => {
      return request(app)
        .patch("/api/articles/monalisa")
        .send({ inc_votes: 30 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should responds with 400 when given request with missing properties", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 400 when given request with invalid properties", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "seventy" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 404 when given unexisting article", () => {
      return request(app)
        .patch("/api/articles/1797")
        .send({ inc_votes: 30 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE requests", () => {
    test("should respond with status 204 and no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("should respond with 400 when given invalid comment ID", () => {
      return request(app)
        .delete("/api/comments/monalisa")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("should respond with 404 when given unexisting comment ID", () => {
      return request(app)
        .delete("/api/comments/1797")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
  });
});
describe("GET /api/users", () => {
  test("should responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
