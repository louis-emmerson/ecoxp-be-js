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

            expect(body.items).toHaveLength(13)

            expect(body.items[0]).toEqual({
                "item_id": 1,
                "material_id": 1,
                "item_name": "Highland Spring Water",
                "barcode": "1234567890"
            })
        })
    })
})

describe("GET /api/items/:item_id", () => {
    it('returns a single item when given an item id', ()=> {
        return request(app)
        .get("/api/items/1")
        .expect(200)
        .then(({body})=> {
            expect(body.item).toEqual({
                "item_id": 1,
                "material_id": 1,
                "item_name": "Highland Spring Water",
                "barcode": '1234567890'
            })
        })
    })
    it("returns 404", () => {
        return request(app)
        .get("/api/items/999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Item does not exist")
        })
    })
    it("returns 400", () => {
        return request(app)
        .get("/api/items/hello")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid id type")
        })
    })
})

describe("GET /api/items/barcode/:barcode", () => {
    it("returns a single item when given a valid barcode", () => {
        return request(app)
        .get("/api/items/barcode/2345678901")
        .expect(200)
        .then(({body})=> {
            expect(body.item).toEqual({
                "item_id": 2,
                "material_id": 2,
                "item_name": "Cravendale Milk",
                "barcode": "2345678901"
            })
        })
    })
    it("returns 404", () => {
        return request(app)
        .get("/api/items/barcode/999")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Item does not exist")
        })
    })
    it("returns 404", () => {
        return request(app)
        .get("/api/items/barcode/hello")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Item does not exist")
        })
    })
})