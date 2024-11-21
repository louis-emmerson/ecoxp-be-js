const db = require("../db/connection");

function fetchAllItems() {
  return db.query("SELECT * FROM items;").then(({ rows }) => {
    return rows;
  });
}

function fetchItemById(item_id) {
  return db.query("SELECT * FROM items WHERE item_id = $1", [item_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Item does not exist" });
    }
    return rows[0];
  });
}

function fetchItemByBarcode(barcode) {
  return db.query("SELECT * FROM items WHERE barcode = $1", [barcode]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Item does not exist" });
    }
    return rows[0];
  });
}

function addNewItem({ material_id, item_name, img_url, barcode }) {
  return db
    .query(
      `INSERT INTO items (material_id, item_name, img_url, barcode)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [material_id, item_name, img_url, barcode]
    )
    .then(({ rows }) => {
      console.log(rows, "model");
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
      }
      return rows[0];
    });
}

module.exports = { fetchAllItems, fetchItemById, fetchItemByBarcode, addNewItem };
