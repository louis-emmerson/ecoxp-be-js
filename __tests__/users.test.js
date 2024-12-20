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
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(typeof user.user_id).toBe("number");
          expect(typeof user.username).toBe("string");
          expect(typeof user.first_name).toBe("string");
          expect(typeof user.avatar_img_url).toBe("string");
          expect(typeof user.postcode).toBe("string");
          expect(typeof user.xp).toBe("number");
        });

        expect(body.users[0]).toEqual({
          user_id: 1,
          username: "LeoDiCap",
          first_name: "Leonardo",
          avatar_img_url: "https://avatar.iran.liara.run/public/49.jpg",
          postcode: "LS1 1AZ",
          xp: 970,
        });
      });
  });
  it("should return postcodes with the prefix WF", () => {
    return request(app)
      .get("/api/users?postcode_prefix=WF")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user.postcode.startsWith("WF")).toBe(true);
        });
      });
  });
});
it("should return users whose postcodes start with WF", () => {
  return request(app)
    .get("/api/users?postcode_prefix=WF")
    .expect(200)
    .then(({ body }) => {
      body.users.forEach((user) => {
        expect(user.postcode.startsWith("WF")).toBe(true);
      });
    });
});
it("should return bad request when an invalid postcode prefix query is passed", () => {
  return request(app)
    .get("/api/users?postcode_prefix=Louis")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
it("should return all users with the postcode YO10 4DX", () => {
  return request(app)
    .get("/api/users?postcode=YO10 4DX")
    .expect(200)
    .then(({ body }) => {
      body.users.forEach((user) => {
        expect(user.postcode).toBe("YO10 4DX");
      });
    });
});
it("should return bad request when an invalid query is passed", () => {
  return request(app)
    .get("/api/users?postcode=YOO 1AA")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid postcode format");
    });
});

describe("GET /api/users/:user_id", () => {
  it("should return 200 and the user by its user_id", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          user_id: 1,
          username: "LeoDiCap",
          first_name: "Leonardo",
          avatar_img_url: "https://avatar.iran.liara.run/public/49.jpg",
          postcode: "LS1 1AZ",
          xp: 970,
        });
      });
  });

  it("should return 404 if user_id is valid but no result is found", () => {
    return request(app)
      .get("/api/users/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user with that id found");
      });
  });
  it("should return 400 Invalid id type when passed an invalid id", () => {
    return request(app)
      .get("/api/users/notauserid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/users/:user_id (xp)", () => {
  it("200 should update the user's XP count by 10", () => {
    const newXP = 10;
    const updateXPbyUserID = {
      inc_xp: newXP,
    };
    return request(app)
      .patch("/api/users/1")
      .send(updateXPbyUserID)
      .expect(200)
      .then(({ body }) => {
        const user = body;
        expect(typeof user.user_id).toBe("number");
        expect(typeof user.username).toBe("string");
        expect(typeof user.first_name).toBe("string");
        expect(typeof user.avatar_img_url).toBe("string");
        expect(typeof user.postcode).toBe("string");
        expect(typeof user.xp).toBe("number");

        expect(user).toEqual({
          user_id: 1,
          username: "LeoDiCap",
          first_name: "Leonardo",
          avatar_img_url: "https://avatar.iran.liara.run/public/49.jpg",
          postcode: "LS1 1AZ",
          xp: 980,
        });
      });
  });

  it("should return an appropriate error message if trying to update XP on a non-existent user", () => {
    const newXP = 10;
    const updateXPbyUserID = {
      inc_xp: newXP,
    };
    return request(app)
      .patch("/api/users/999")
      .send(updateXPbyUserID)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user with that id found");
      });
  });

  it("should return an appropriate error message if trying to update XP on an invalid user_id", () => {
    const newXP = 10;
    const updateXPbyUserID = {
      inc_xp: newXP,
    };
    return request(app)
      .patch("/api/users/not-a-user-id")
      .send(updateXPbyUserID)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
