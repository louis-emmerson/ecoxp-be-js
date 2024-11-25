const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/recyclability", () => {
  it("200 should return all items describing whether they are recyclable or not by council", () => {
    return request(app)
      .get("/api/recyclability")
      .expect(200)
      .then(({ body }) => {
        body.items.forEach((item) => {
          expect(typeof item.recyclable_id).toBe("number");
          expect(typeof item.council).toBe("string");
          expect(typeof item.material).toBe("number");
          expect(typeof item.is_recyclable).toBe("boolean");
        });

        expect(body.items).toHaveLength(39);

        expect(body.items[0]).toEqual({
          recyclable_id: 1,
          council: "YO",
          material: 1,
          is_recyclable: true,
        });
      });
  });
});

//
describe.only("GET /api/recyclability/:council/:material", () => {
  it("returns a single item when given a material_id", () => {
    return request(app)
      .get("/api/recyclability/YO/6")
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toEqual({
          recyclable_id: 6,
          council: "YO",
          material: 6,
          is_recyclable: true,
        });
      });
  });
  it("returns 404 when passed a non-existent postcode prefix and or material_id", () => {
    return request(app)
      .get("/api/recyclability/UR/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("The postcode prefix or material you have entered does not exist");
      });
  });
  it("returns 400 when passed invalid item_id/postcode prefix", () => {
    return request(app)
      .get("/api/recyclability/676/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
