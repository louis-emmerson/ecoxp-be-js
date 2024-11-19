const request = require("supertest")
const db = require("../db/connection")
const app = require("../app")
const testData = require("../db/data/test-data")

//SEED GOES HERE :)
// beforeEach(()=>{
//     // return seed(testData)
// })

afterAll(()=>{
    return db.end()
  })

describe("GET /api/items", () => {
  it("should respond with an array of all items", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(typeof user.user_id).toBe("number")
          expect(typeof user.username).toBe("string")
          expect(typeof user.avatar_img_url).toBe("string")
          expect(typeof user.postcode).toBe("string")
          expect(typeof user.xp).toBe("number")
        })

        expect(body.users[0]).toEqual({
          user_id: 1,
          username: "LeoDiCap",
          avatar_img_url: "https://avatar.iran.liara.run/public/49.jpg",
          postcode: "LS1 1AZ",
          xp: 970,
        })
      })
  }),
    it("should return 404 if user_id is valid but no result is found", () => {
      return request(app)
        .get("/api/users/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No user with that id found")
        })
    }),
    it("should return 400 bad request when passed an invalid id", () => {
      return request(app)
        .get("/api/users/notauserid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request")
        })
    })
  it("should return postcodes with the prefix WF", () => {
    return request(app)
      .get("/api/users?postcode_prefix=WF")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user.postcode.startsWith("WF")).toBe(true)
        })
      })
  })
  it("should return bad request when an invalid query is passed", () => {
    return request(app)
      .get("/api/users?postcode_prefix=Louis")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  })
})
