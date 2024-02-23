# Northcoders News API

## Hosted Version

Hosted Version: [NC-NEWS](https://nc-news-i824.onrender.com)

## Project Overview

The Northcoders News API is a backend service that provides programmatic access to application data. It emulates the functionality of real-world platforms like Reddit, enabling seamless communication with frontend architectures.

We're utilizing `PostgreSQL` for our database and interacting with it through node-postgres in our `Node.js` environment. This setup enables us to build a flexible and reliable backend system that seamlessly integrates with different frontend architectures. The application listens for requests coming from the user's side at different points in the system, known as endpoints. It retrieves the required information from the news database and sends it as a response to fulfill the user's request.


## Project Set Up

### Clone the Repository

- Clone the Repository:

`git clone https://github.com/amedelmouahidi/nc-news`

### Install Dependencies

- Navigate to the project directory:

  `cd nc-news`

- Install Dependencies:

  `npm install` 

### Create and connect Databases locally

- Set Up Environment Variables creating two `.env` files in the project's root directory: 

    .env.development
  
  ```
  PGDATABASE=nc_news
  ```

    .env.test

  ```
  PGDATABASE=nc_news_test
  ```

- Ensure that these `.env` files are listed in `.gitignore` to keep sensitive information secure.

### Seed the Databases

- Create the databases:

  `npm run setup-dbs` 

- Seed the local databases:  

  `npm run seed` 


### Run Tests

- Ensure the project is configured correctly by running tests:

  `npm test` 

### Minimum Version Requirements

- Node.js: v21.4.0 
- PostgreSQL: v14.10




