const { fetchAllItems, fetchItemById, fetchItemByBarcode } = require("../models/items-models")

function getAllItems(request, response, next){
    fetchAllItems()
    .then((items)=>{
        response.status(200).send({items})
    })
    .catch(next)
}

function getItemById(request, response, next){

    const {item_id} =  request.params

    fetchItemById(item_id)
    .then((item) => {
        response.status(200).send({item})
    })
    .catch(next)
}

function getItemByBarcode(request, response, next){

    const {barcode} = request.params

    fetchItemByBarcode(barcode)
    .then((item) => {
        response.status(200).send({item})
    })
    .catch(next)
}

module.exports = {getAllItems, getItemById, getItemByBarcode}