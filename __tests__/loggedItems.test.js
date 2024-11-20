const request = require("supertest")
const db = require("../db/connection")
const app = require("../app")
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
  return db.end()
})

describe("GET /api/logged-items", () => {
  it("should return an array of all logged-items", () => {
    return request(app)
      .get("/api/logged-items")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(typeof loggedItem.logged_item_id).toBe("number")
          expect(typeof loggedItem.item_id).toBe("number")
          expect(typeof loggedItem.user_id).toBe("number")
          expect(typeof loggedItem.date).toBe("string")
        })
      })
  })
  it("should return return all the items logged on the queried date ", () => {
    return request(app)
      .get("/api/logged-items?date=2024-03-20")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          const loggedDate = loggedItem.date.split("T")[0]
          expect(loggedDate).toBe("2024-03-20")
        })
      })
  })
  it("should return an error when queried with a date in the incorrect format ", () => {
    return request(app)
      .get("/api/logged-items?date=24-03-20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("should return an array of logged_items matching the queried postcode ", () => {
    return request(app)
      .get("/api/logged-items?postcode=LS1 1AZ")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem)=>{
            expect(loggedItem.postcode).toBe('LS1 1AZ')
        })
      })
  })
  it("should return an array of logged_items matching the queried postcode and queried date ", () => {
    return request(app)
      .get("/api/logged-items?postcode=LS1 1AZ&date=2024-03-17")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem)=>{
            expect(loggedItem.postcode).toBe('LS1 1AZ')
            const loggedDate = loggedItem.date.split('T')[0]
            expect(loggedDate).toBe('2024-03-17')
        })
      })
  })
})

describe("GET /api/:user_id/logged-items", () => {
  it("should return an array of all logged-items by specific user id", () => {
    return request(app)
      .get("/api/2/logged-items")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(loggedItem.user_id).toBe(2)
        })
      })
  })
  it("should return a 404 and no logged items found by that user", () => {
    return request(app)
      .get("/api/99/logged-items")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no logged items found by that user")
      })
  })
  it("should return a 400 and bad request when passed an invalid user id", () => {
    return request(app)
      .get("/api/notanID/logged-items")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  })
  it("should return a 200 an array of loggedItems by the user_id passed on the queried date", () => {
    return request(app)
      .get("/api/2/logged-items?date=2024-03-19")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((logged_item)=>{
            const loggedDate = logged_item.date.split('T')[0]
            expect(loggedDate).toBe('2024-03-19')
        })
      })
  })
  it("should return a 400 bad request when queried with a date in am incorrect format", () => {
    return request(app)
      .get("/api/2/logged-items?date=24-03-19")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid date format')
      })
  })
  
})
