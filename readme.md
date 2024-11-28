# EcoXP API

Welcome to the EcoXP API! This project is a RESTful API designed to serve as the backend forthe gamified recycling app designed to incentivize sustainable practices by rewarding users with XP for their recycling efforts.

## Hosted Version
[Click here](https://ecoxp-be.onrender.com/api) to view the hosted version of the project.

## Project Summary

The EcoXP API allows users to interact with a database of items, logged_items, materials, councils, postcodes and followers. Users can fetch logged_items, post new logged items, post new items, update XP, and more. The API is built using Node.js, Express, and PostgreSQL.

### Key Features:
**GET** endpoints for retrieving items, logged items, and users.
**POST** endpoints for adding new items and logged itmes.
**PATCH** endpoints for updating user xp.

### Requirements

To run this project, you need to have the following installed on your machine:

**Node.js** version 14.0.0 or higher
**PostgreSQL** version 12.0 or higher

## Getting Started

Follow these instructions to get a copy of the project running locally.

### 1. Clone the repository

```bash
git clone https://github.com/louis-emmerson/ecoxp-be-js.git
cd ecoxp-be-js
```

### 2. Install Dependencies
Use npm to install the required dependencies:

```bash

npm install
```

### 3. Set Up Environment Variables
Create two .env files, one for the development database and one for the test database.

.env.development
```makefile

PGDATABASE=your_development_db_name
```
.env.test
```makefile
PGDATABASE=your_test_db_name
```
Make sure the values of PGDATABASE correspond to your Postgres databases for development and testing.

Refer to the .env-example file for guidance.

### 4. Seed Local Database
To seed your local database with sample data, run the following command:

```bash
npm run seed
```
### 5. Running the Tests
To run the test suite, use:

```bash
npm test
```
### 6. Running the API
To start the API locally, run:

```bash
npm start
```
This will start the server on http://localhost:9090.
