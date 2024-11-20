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

describe("GET /api/materials", () => {
  it("should respond with an array of all materials", () => {
    return request(app)
      .get("/api/materials")
      .expect(200)
      .then(({ body }) => {
        const materials = body.materials;
        materials.forEach((material) => {
          expect(typeof material.material_id).toBe("number");
          expect(typeof material.material_name).toBe("string");
          expect(typeof material.xp).toBe("number");
          if (material.plastic_code !== null) {
            expect(typeof material.plastic_code).toBe("number");
          } else {
            expect(material.plastic_code).toBeNull();
          }
        });

        expect(materials).toHaveLength(13);

        expect(materials[0]).toEqual({
          material_id: 1,
          material_name: "Polyethylene Terephthalate",
          xp: 10,
          plastic_code: 1,
        });
      });
  });
});

describe("GET /api/materials/:material_id", () => {
  it("should return a single material when given a material id whose plastic_code is null", () => {
    return request(app)
      .get("/api/materials/6")
      .expect(200)
      .then(({ body }) => {
        const material = body.material;
        expect(typeof material.material_id).toBe("number");
        expect(typeof material.material_name).toBe("string");
        expect(typeof material.xp).toBe("number");
        expect(material.plastic_code).toBeNull();

        expect(material).toEqual({
          material_id: 6,
          material_name: "Cardboard",
          xp: 10,
          plastic_code: null,
        });
      });
  });

  it("should return a single material when given a material id whose plastic_code is not null", () => {
    return request(app)
      .get("/api/materials/1")
      .expect(200)
      .then(({ body }) => {
        const material = body.material;
        expect(typeof material.material_id).toBe("number");
        expect(typeof material.material_name).toBe("string");
        expect(typeof material.xp).toBe("number");
        expect(typeof material.plastic_code).toBe("number");

        expect(material).toEqual({
          material_id: 1,
          material_name: "Polyethylene Terephthalate",
          xp: 10,
          plastic_code: 1,
        });
      });
  });

  it("should return the relevant error if given a valid material_id that does not exist", () => {
    return request(app)
      .get("/api/materials/999")
      .expect(404)
      .then(({ body }) => {
        const errorMsg = body.msg;
        expect(errorMsg).toBe("Material does not exist");
      });
  });

  it("should return the relevant error if given an invalid material_id", () => {
    return request(app)
      .get("/api/materials/not-a-number")
      .expect(400)
      .then(({ body }) => {
        const errorMsg = body.msg;
        console.log(errorMsg);
        expect(errorMsg).toBe("Invalid id type");
      });
  });
});
