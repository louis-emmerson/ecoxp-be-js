const { fetchAllItems } = require("../models/items-models")

function getAllItems(request, response){
    fetchAllItems()
    .then((items)=>{
        response.status(200).send({items})
    })
}

module.exports = {getAllItems}