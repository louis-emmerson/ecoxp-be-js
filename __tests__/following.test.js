const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(()=>{
    return seed(testData)}
)

afterAll(()=>{
    return db.end()
})

describe("GET /api/:user_id/following", () => {
  it("should return an array of users that are followed by the user_id passed", () => {
    return request(app)
    .get('/api/1/following')
    .expect(200)
    .then(({body})=>{
        expect(body.following.length).toBe(4)

        body.following.forEach((following)=>{
            expect(typeof following.original_user_id).toBe("number")
            expect(typeof following.original_user_id).toBe("number")
            expect(typeof following.username).toBe("string")
            expect(typeof following.first_name).toBe("string")
            expect(typeof following.avatar_img_url).toBe("string")
            expect(typeof following.postcode).toBe("string")
            expect(typeof following.xp).toBe("number")
        })
    })
  })
  it('should return a 404 user not found if a user_id that does not exist is passed',()=>{
    return request(app)
    .get('/api/99/following')
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe('No user found with that id')
    })

  })
  it('should return a 400 bad request if passed a user_id in an invalid format',()=>{
    return request(app)
    .get('/api/notanid/following')
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe('Bad Request')
    })

  })
})

describe("PATCH /api/:user_id/following",()=>{
    it('should add a new follower entry to the following table and return the newly created entry',()=>{
        return request(app)
        .patch("/api/5/following")
        .send({
            follower_id:"4"
        })
        .expect(201)
        .then(({body})=>{
            expect(typeof body.newFollow.following_id)
            expect(body.newFollow.user_id).toBe(5)
            expect(body.newFollow.follower_id).toBe(4)
        })
    })
})