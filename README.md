# Beautycase - Backend

## Project Overview

This repository contains the backend of the Beautycase web application, designed for makeup artists to manage their workflow efficiently. It provides RESTful APIs for user authentication, lesson management, product recommendations, and administrative functionalities.

## Features

-   **User Authentication** – Secure login and registration with JWT.
-   **Role-based access control** – Restricts access based on user roles.
-   **Input validation** - Ensures data is valid and secure.
-   **Lessons Management** – CRUD operations for lessons with video content.
-   **Product Recommendations** – Manage and display recommended beauty products.
-   **Client Data Handling** – Store and retrieve client information.
-   **Logging system** - Records system events and errors.
-   **File Uploads** – Store images using **Cloudinary**.
-   **CORS Support** – Configurable CORS settings.
-   **Environment Variables** – Securely manage configuration using `.env`.

## Technology Stack

-   **Language**: TypeScript
-   **Framework:** Node.js with Express.js
-   **Database:** MongoDB (via MongoDB Atlas)
-   **Validation:** Joi
-   **Authentication**: JSON Web Tokens (JWT)
-   **File Storage:** Cloudinary
-   **Environment Management:** dotenv

### Dev Tools

-   **Mongoose (ODM for MongoDB)**
-   **Nodemon & ts-node-dev** (for development)
-   **Chalk** (for CLI logging)
-   **Multer** (for handling file uploads)

## Authentication

The backend supports three user roles:

-   `admin`: Full system access
-   `mua`: Makeup artist permissions
-   `client`: Basic user permissions

## API Endpoints

### Authentication

-   `POST /api/auth/register`: User registration
-   `POST /api/auth/login`: User login
-   `POST /api/auth/logout`: User logout
-   `GET /api/auth/refresh`: Token refresh

### Other Endpoints

-   Products, Brands, Lessons, Tools, Stages, Users, etc.
-   Detailed role-based access control
-   Comprehensive input validation

## License

Distributed under the ISC License.

## Contact

For any inquiries or contributions, feel free to reach out.

-   Author: Artem Denisov
-   LinkedIn: [linkedin.com/in/lifeinplus](https://www.linkedin.com/in/lifeinplus)
