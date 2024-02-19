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
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
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
  });