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

describe("GET /api/items", () => {
  it("should respond with an array of all items", () => {
    return request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        body.items.forEach((item) => {
          expect(typeof item.item_id).toBe("number");
          expect(typeof item.material_id).toBe("number");
          expect(typeof item.item_name).toBe("string");
          expect(typeof item.img_url).toBe("string");
          expect(typeof item.barcode).toBe("string");
        });

        expect(body.items).toHaveLength(13);

        expect(body.items[0]).toEqual({
          item_id: 1,
          material_id: 1,
          item_name: "Highland Spring Water",
          img_url: "https://assets.sainsburys-groceries.co.uk/gol/2954950/1/1500x1500.jpg",
          barcode: "1234567890",
        });
      });
  });
});

describe("GET /api/items/:item_id", () => {
  it("returns a single item when given an item id", () => {
    return request(app)
      .get("/api/items/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.item).toEqual({
          item_id: 1,
          material_id: 1,
          item_name: "Highland Spring Water",
          img_url: "https://assets.sainsburys-groceries.co.uk/gol/2954950/1/1500x1500.jpg",
          barcode: "1234567890",
        });
      });
  });
  it("returns 404", () => {
    return request(app)
      .get("/api/items/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item does not exist");
      });
  });
  it("returns 400", () => {
    return request(app)
      .get("/api/items/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/items/barcode/:barcode", () => {
  it("returns a single item when given a valid barcode", () => {
    return request(app)
      .get("/api/items/barcode/2345678901")
      .expect(200)
      .then(({ body }) => {
        expect(body.item).toEqual({
          item_id: 2,
          material_id: 2,
          item_name: "Cravendale Milk",
          img_url: "https://assets.sainsburys-groceries.co.uk/gol/3216590/1/1500x1500.jpg",
          barcode: "2345678901",
        });
      });
  });
  it("returns 404", () => {
    return request(app)
      .get("/api/items/barcode/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item does not exist");
      });
  });
  it("returns 404", () => {
    return request(app)
      .get("/api/items/barcode/hello")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Item does not exist");
      });
  });
});

describe("POST /api/items", () => {
  it("201: should post a new item to the database", () => {
    const newItem = {
      material_id: 8,
      item_name: "Aerosol deodorant",
      img_url: "https://assets.sainsburys-groceries.co.uk/gol/6310715/1/1500x1500.jpg",
      barcode: "4005808298174",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(201)
      .then(({ body }) => {
        const item = body.item;
        expect(item).toEqual({
          material_id: 8,
          item_name: "Aerosol deodorant",
          img_url: "https://assets.sainsburys-groceries.co.uk/gol/6310715/1/1500x1500.jpg",
          item_id: 14,
          barcode: "4005808298174",
        });
      });
  });
  it("400: should return with appropriate error message when fields are blank", () => {
    const newItem = {
      material_id: null,
      item_name: "",
      img_url: "",
      barcode: "",
    };
    return request(app)
      .post("/api/items")
      .send(newItem)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
});
