const request = require("supertest")
const db = require("../db/connection")
const app = require("../app")
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const logged_items = require("../db/data/test-data/logged_items")

beforeEach(() => {
  return seed(testData)
})

afterAll(() => {
  return db.end()
})

describe("GET /api/logged-items", () => {
  it("200: should return an array of all logged-items", () => {
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
  it("200: should return return all the items logged on the queried date ", () => {
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
  it("400: should return an error when queried with a date in the incorrect format ", () => {
    return request(app)
      .get("/api/logged-items?date=24-03-20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("200: should return an array of logged_items matching the queried postcode ", () => {
    return request(app)
      .get("/api/logged-items?postcode=LS1 1AZ")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(loggedItem.postcode).toBe("LS1 1AZ")
        })
      })
  })
  it("400: should return an error when passed a postcode in the wrong format", () => {
    return request(app)
      .get("/api/logged-items?postcode=LS16 000")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid postcode format")
      })
  })
  
  it("200: should return an array of logged_items matching the queried postcode and queried date ", () => {
    return request(app)
      .get("/api/logged-items?postcode=LS1 1AZ&date=2024-03-17")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(loggedItem.postcode).toBe("LS1 1AZ")
          const loggedDate = loggedItem.date.split("T")[0]
          expect(loggedDate).toBe("2024-03-17")
        })
      })
  })
  it("200: Should return an array of logged_items between the queried date ranges", () => {
    return request(app)
      .get("/api/logged-items?start=2024-03-17&end=2024-03-20")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body

        expect(Array.isArray(loggedItems)).toBe(true)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const startDate = new Date("2024-03-17")
          const endDate = new Date("2024-03-20")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
          expect(itemDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
        })
      })
  })
  it("200: Should return an array of logged_items before the queried date end", () => {
    return request(app)
      .get("/api/logged-items?end=2024-03-19")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body
        expect(Array.isArray(loggedItems)).toBe(true)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const endDate = new Date("2024-03-19")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
        })
      })
  })
  it("200: Should return an array of logged_items after the queried start data", () => {
    return request(app)
      .get("/api/logged-items?start=2024-03-20")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body

        expect(Array.isArray(loggedItems)).toBe(true)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const startDate = new Date("2024-03-20")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
        })
      })
  })
  it("400: Should return an error if passed an invalid start date", () => {
    return request(app)
      .get("/api/logged-items?start=202/03/20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("400: Should return an error if passed an invalid end date", () => {
    return request(app)
      .get("/api/logged-items?end=202/03/20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("200: should return an array of logged_items matching the queried postcode_prefix", () => {
    return request(app)
      .get("/api/logged-items?postcode_prefix=LS")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(loggedItem.postcode.startsWith("LS")).toBe(true)
        })
      })
  })
  it("200: should return an array of logged_items matching the queried postcode_prefix", () => {
    return request(app)
      .get("/api/logged-items?postcode_prefix=LS&date=2024-03-19")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          const formattedDate = loggedItem.date.split("T")[0]
  
          expect(loggedItem.postcode.startsWith("LS")).toBe(true)
          expect(formattedDate).toBe("2024-03-19")
        })
      })
  })
  it("200: should return an empty array when passed a postcode_prefix that doesnt exist", () => {
    return request(app)
      .get("/api/logged-items?postcode_prefix=BD")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.loggedItems)).toBe(true)
        expect(body.loggedItems.length).toBe(0)
      })
  })
  it("400: should return an error when passed a postcode prefix in the wrong format", () => {
    return request(app)
      .get("/api/logged-items?postcode_prefix=1B")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid postcode_prefix format")
      })
  })
})

describe("GET /api/:user_id/logged-items", () => {
  it("200: should return an array of all logged-items by specific user id", () => {
    return request(app)
      .get("/api/2/logged-items")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((loggedItem) => {
          expect(loggedItem.user_id).toBe(2)
          expect(typeof loggedItem.item_name).toBe("string")
          expect(typeof loggedItem.img_url).toBe("string")
          expect(typeof loggedItem.barcode).toBe("string")
          expect(typeof loggedItem.material_id).toBe("number")
          expect(typeof loggedItem.material_name).toBe("string")
          expect(typeof loggedItem.xp).toBe("number")
        })
      })
  })
  it("404: should return an error no logged items found by that user", () => {
    return request(app)
      .get("/api/99/logged-items")
      .expect(200)
      .then(({ body }) => {
        expect(body.loggedItems.length).toBe(0)
      })
  })
  it("400: should return a 400 and bad request when passed an invalid user id", () => {
    return request(app)
      .get("/api/notanID/logged-items")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request")
      })
  })
  it("200: should return a 200 an array of loggedItems by the user_id passed on the queried date", () => {
    return request(app)
      .get("/api/2/logged-items?date=2024-03-19")
      .expect(200)
      .then(({ body }) => {
        body.loggedItems.forEach((logged_item) => {
          const loggedDate = logged_item.date.split("T")[0]
          expect(loggedDate).toBe("2024-03-19")
        })
      })
  })
  it("400: should return a 400 bad request when queried with a date in am incorrect format", () => {
    return request(app)
      .get("/api/2/logged-items?date=24-03-19")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("200: Should return an array of logged_items between the queried date ranges by user_id", () => {
    return request(app)
      .get("/api/2/logged-items?start=2024-11-24&end=2024-11-25")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body

        expect(Array.isArray(loggedItems)).toBe(true)
        expect(loggedItems.length).toBe(2)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const startDate = new Date("2024-11-24")
          const endDate = new Date("2024-11-25")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
          expect(itemDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
        })
      })
  })
  it("200: Should return an array of logged_items before the queried date end", () => {
    return request(app)
      .get("/api/logged-items?end=2024-03-19")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body

        expect(loggedItems.length).toBe(4)
        expect(Array.isArray(loggedItems)).toBe(true)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const endDate = new Date("2024-03-19")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
        })
      })
  })
  it("200: Should return an array of logged_items after the queried start data", () => {
    return request(app)
      .get("/api/logged-items?start=2024-11-24")
      .expect(200)
      .then(({ body }) => {
        const { loggedItems } = body

        expect(loggedItems.length).toBe(2)
        expect(Array.isArray(loggedItems)).toBe(true)

        loggedItems.forEach((loggedItem) => {
          const itemDate = new Date(loggedItem.date)
          const startDate = new Date("2024-11-24")

          expect(itemDate).toEqual(expect.any(Date))
          expect(itemDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
        })
      })
  })
  it("400: Should return an error if passed an invalid start date", () => {
    return request(app)
      .get("/api/logged-items?start=202/03/20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
  it("400: Should return an error if passed an invalid end date", () => {
    return request(app)
      .get("/api/logged-items?end=202/03/20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid date format")
      })
  })
})

describe("POST /api/logged-items", () => {
  it("201: should succesfully add a logged item to the database", () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()

    const today_formatted = yyyy + "-" + mm + "-" + dd

    const newLoggedItem = {
      item_id: 6,
      user_id: 4,
    }
    return request(app)
      .post("/api/logged-items")
      .send(newLoggedItem)
      .expect(201)
      .then(({ body }) => {
        const item = body.item
        const formattedDate = item.date.split("T")[0]

        expect(item.logged_item_id).toBe(9)
        expect(item.item_id).toBe(6)
        expect(item.user_id).toBe(4)
        expect(formattedDate).toEqual(today_formatted)
      })
  })
  it("400: should return with appropriate error message when fields are blank", () => {
    const newLoggedItem = {
      item_id: null,
      user_id: null,
    }
    return request(app)
      .post("/api/logged-items")
      .send(newLoggedItem)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields")
      })
  })
})
