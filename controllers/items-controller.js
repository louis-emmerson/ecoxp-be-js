const {
  fetchAllItems,
  fetchItemById,
  fetchItemByBarcode,
  addNewItem,
} = require("../models/items-models");

function getAllItems(request, response, next) {
  fetchAllItems()
    .then((items) => {
      response.status(200).send({ items });
    })
    .catch(next);
}

function getItemById(request, response, next) {
  const { item_id } = request.params;

  fetchItemById(item_id)
    .then((item) => {
      response.status(200).send({ item });
    })
    .catch(next);
}

function getItemByBarcode(request, response, next) {
  const { barcode } = request.params;

  fetchItemByBarcode(barcode)
    .then((item) => {
      response.status(200).send({ item });
    })
    .catch(next);
}

function postNewItem(request, response, next) {
  const { material_id, item_name, img_url, barcode } = request.body;

  if (!material_id || !item_name || !img_url || !barcode) {
    return response.status(400).send({ msg: "Missing required fields" });
  }

  const newItem = { material_id, item_name, img_url, barcode };

  addNewItem(newItem)
    .then((item) => {
      console.log(item, "controller");
      response.status(201).send({ item });
    })
    .catch(next);
}

module.exports = { getAllItems, getItemById, getItemByBarcode, postNewItem };
