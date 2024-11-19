const db = require("../db/connection")

function fetchAllItems(){
    return db.query('SELECT * FROM items;')
    .then(({rows})=>{
        return rows
    })
}

module.exports ={fetchAllItems}