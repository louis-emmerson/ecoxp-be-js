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

describe("GET /api/postcodes/:postcode", () => {
  it("200: should return an individual postcode object when given the logged in user's postcode", () => {
    return request(app)
      .get("/api/postcodes/LS1 1BA")
      .expect(200)
      .then(({ body }) => {
        const postcode = body.postcode;
        expect(typeof postcode.postcode).toBe("string");
        expect(typeof postcode.postcode_prefix).toBe("string");
        expect(typeof postcode.area).toBe("string");
        expect(typeof postcode.garden_bin_collection).toBe("string");
        expect(typeof postcode.waste_bin_collection).toBe("string");
        expect(typeof postcode.recycling_bin_collection).toBe("string");

        expect(postcode.postcode).toEqual("LS1 1BA");
        expect(postcode.postcode_prefix).toEqual("LS");
        expect(postcode.area).toEqual("Leeds City Centre");
        expect(postcode.garden_bin_collection).toEqual("WED");
        expect(postcode.waste_bin_collection).toEqual("MON");
        expect(postcode.recycling_bin_collection).toEqual("THUR");
      });
  });
  it("404: should return appropriate error message when given a valid but non-existent postcode", () => {
    return request(app)
      .get("/api/postcodes/LS16 2FE")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Postcode does not exist on the system");
      });
  });
});
