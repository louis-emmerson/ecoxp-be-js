const format = require("pg-format")
const db = require("../connection")
const {
  followersData,
  itemsData,
  logged_itemsData,
  materialsData,
  postcodesData,
} = require("../data/test-data")

const seed = ({
  councilsData,
  followersData,
  itemsData,
  loggedItemsData,
  materialsData,
  postcodesData,
  usersData,
}) => {
  return db
    .query("DROP TABLE IF EXISTS following")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS council_material_recyclability")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS logged_items")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS postcodes")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS councils")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS items")
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS materials")
    })
    .then(() => {
      const createCouncilTable = db.query(`
                CREATE TABLE councils 
                (postcode_prefix text PRIMARY KEY,
                council text,
                website text,
                recycling_bin_colour text,
                waste_bin_colour text,
                garden_bin_colour text)`)

      const createTableMaterials = db.query(`
                CREATE TABLE materials
                (material_id SERIAL PRIMARY KEY,
                material_name text,
                xp int,
                plastic_code int)`)

      return Promise.all([createCouncilTable, createTableMaterials])
    })
    .then(() => {
      const createPostcodesTable = db.query(`
            CREATE TABLE postcodes
            (postcode text PRIMARY KEY,
            postcode_prefix text REFERENCES councils,
            area text,
            garden_bin_collection text,
            waste_bin_collection text,
            recycling_bin_collection text
            )`)
      const createItemsTable = db.query(`
            CREATE TABLE items
            (item_id SERIAL PRIMARY KEY,
            material_id int REFERENCES materials,
            item_name text,
            barcode text)`)
      const councilRecyclableTable = db.query(`
            CREATE TABLE council_material_recyclability(
            recyclable_id SERIAL PRIMARY KEY,
            council TEXT REFERENCES councils,
            material INT REFERENCES materials,
            recyclable BOOL
            )
        `)
      return Promise.all([
        createPostcodesTable,
        createItemsTable,
        councilRecyclableTable,
      ])
    })
    .then(() => {
      return db.query(`
            CREATE TABLE users
            (user_id SERIAL PRIMARY KEY,
            username text,
            avatar_img_url text,
            postcode text REFERENCES postcodes,
            xp int
            )`)
    })
    .then(() => {
      const createFollowingTable = db.query(`
            CREATE TABLE following
            (following_id SERIAL PRIMARY KEY,
            user_id int REFERENCES users,
            follower_id int REFERENCES users
            )`)

      const createLoggedItemsTable = db.query(`
            CREATE TABLE logged_items(
            logged_item_id SERIAL PRIMARY KEY,
            item_id int REFERENCES items,
            user_id int REFERENCES users,
            date date)`)
      return Promise.all([createFollowingTable, createLoggedItemsTable])
    })
    .then(() => {
      const insertCouncilQuery = format(
        "INSERT INTO councils (postcode_prefix, council,website,recycling_bin_colour,waste_bin_colour,garden_bin_colour) VALUES %L;",
        councilsData.map(
          ({
            postcode_prefix,
            council,
            website,
            recycling_bin_colour,
            waste_bin_colour,
            garden_bin_colour,
          }) => [
            postcode_prefix,
            council,
            website,
            recycling_bin_colour,
            waste_bin_colour,
            garden_bin_colour,
          ]
        )
      )
      return db.query(insertCouncilQuery)
    })
    .then(()=> {

      const insertPostcodes = format(
        "INSERT INTO postcodes (postcode, postcode_prefix, area, garden_bin_collection, waste_bin_collection, recycling_bin_collection) VALUES %L;",
        postcodesData.map(
          ({
            postcode,
            postcode_prefix,
            area,
            garden_bin_collection,
            waste_bin_collection,
            recycling_bin_collection,
          }) => [
            postcode,
            postcode_prefix,
            area,
            garden_bin_collection,
            waste_bin_collection,
            recycling_bin_collection,
          ]
        )
      )
      return db.query(insertPostcodes)
    })
    .then(() => {

      const insertMaterials = format(
        `
        INSERT INTO materials(material_name,xp,plastic_code) VALUES %L`,
        materialsData.map(({ material_name, xp, plastic_code }) => [
          material_name,
          xp,
          plastic_code,
        ])
      )
  
      return db.query(insertMaterials)
    })
    .then(() => {
      const insertUsers = format(
        `INSERT INTO users (username, avatar_img_url,postcode,xp) VALUES %L;`,
        usersData.map(({ username, avatar_img_url, postcode, xp }) => [
          username,
          avatar_img_url,
          postcode,
          xp,
        ])
      )

      return db.query(insertUsers)

    })
    .then(() => {

      const insertItems = format(
        `INSERT INTO items (material_id, item_name, barcode) VALUES %L`,
        itemsData.map(({ material_id, item_name, barcode }) => [
          material_id,
          item_name,
          barcode,
        ])
      )
  
      return db.query(insertItems)

    })
    .then(() => {
      const insertFollowing = format(
        `INSERT INTO following (user_id, follower_id) VALUES %L`,
        followersData.map(({ user_id, follower_id }) => [user_id, follower_id])
      )
      
      const followingQuery = db.query(insertFollowing)

      const insertLoggedItems = format(` INSERT INTO logged_items (item_id, user_id, date) VALUES %L`,loggedItemsData.map(({item_id,user_id,date})=>[item_id,user_id,date]))

      const loggedItemsQuery = db.query(insertLoggedItems)
      return Promise.all([followingQuery,loggedItemsQuery])
    })
}

module.exports = seed
