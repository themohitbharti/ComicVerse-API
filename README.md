# ComicVerse - Comic Book Management Backend

## Description

The ComicVerse API is a backend system designed for managing comic book inventory in an e-commerce store. It allows the store manager to perform CRUD (Create, Read, Update, Delete) operations on comic books and manage inventory efficiently. Built using Node.js, Express.js, and MongoDB, this RESTful service provides endpoints for creating, editing, deleting, and fetching comic book details, with support for pagination, filtering, and sorting.

## Features

- **CRUD Operations**: Add, update, delete, and retrieve comic books.
- **Pagination**: Support for paginated listing of large comic book inventories.
- **Filtering**: Filter comic books based on attributes like author, year, price, and condition.
- **Sorting**: Sort comic books by price, year of publication, or alphabetically.
- **Error Handling**: Comprehensive validation and error responses for various scenarios.

## Technologies Used

- **Node.js**: A JavaScript runtime for building scalable applications.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing comic book details.
- **Mongoose**: ODM for connecting and managing MongoDB collections.
- **dotenv**: Module for managing environment variables.
- **pm2**: Process manager for running the app in production.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-github-username/comicverse-backend.git
