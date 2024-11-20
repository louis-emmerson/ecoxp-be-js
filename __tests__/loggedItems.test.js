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

describe('GET /api/logged-items',()=>{
    it('should return an array of all logged-items',()=>{
        return request(app)
        .get('/api/logged-items')
        .expect(200)
        .then(({body})=>{
            body.loggedItems.forEach(loggedItem => {
                expect(typeof loggedItem.logged_item_id).toBe("number")
                expect(typeof loggedItem.item_id).toBe("number")
                expect(typeof loggedItem.user_id).toBe("number")
                expect(typeof loggedItem.date).toBe("string")
                
            });
        })
    })
})
describe('GET /api/:user_id/logged-items',()=>{
    it('should return an array of all logged-items by specific user id',()=>{
        return request(app)
        .get('/api/2/logged-items')
        .expect(200)
        .then(({body})=>{
            body.loggedItems.forEach(loggedItem => {
                expect(loggedItem.user_id).toBe(2)
            });
        })
    })
    it('should return a 404 and no logged items found by that user',()=>{
        return request(app)
        .get('/api/99/logged-items')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("no logged items found by that user")
        })
    })
    it('should return a 400 and bad request when passed an invalid user id',()=>{
        return request(app)
        .get('/api/notanID/logged-items')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
})