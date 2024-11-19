const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const testData = require('../db/data/test-data')


//SEED GOES HERE :)
// beforeEach(()=>{
//     // return seed(testData)
// })

describe("GET /api/items",()=>{
    it('should respond with an array of all items',()=>{
        return request(app)
        .get("/api/items")
        .expect(200)
        .then(({body})=>{
            body.items.forEach((item) => {
                expect(typeof item.item_id).toBe("number")
                expect(typeof item.material_id).toBe("number")
                expect(typeof item.item_name).toBe("string")
                expect(typeof item.barcode).toBe("string")
            });

            expect(body.items[0]).toEqual({
                "item_id": 1,
                "material_id": 1,
                "item_name": "Highland Spring Water",
                "barcode": "1234567890"
              })
        })
    })
})