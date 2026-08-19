# E-Commerce Platform



A full-stack e-commerce web application built with React, Flask, PostgreSQL, JWT authentication, and Docker.



## 🚀 Features



### Customer Features



- User registration

- User login

- JWT authentication

- Browse products

- Search products

- Product details

- Add products to cart

- Increase/decrease cart quantity

- Remove products from cart

- Wishlist

- Checkout

- Place orders

- View order history



### Admin Features



- Admin authentication

- Admin dashboard

- Product management

- Order management



## 🛠️ Technology Stack



### Frontend



- React

- Vite

- React Router

- JavaScript

- CSS



### Backend



- Python

- Flask

- Flask-CORS

- Flask-JWT-Extended

- Psycopg

- Werkzeug password hashing



### Database



- PostgreSQL



### DevOps



- Docker

- Docker Compose

- Git

- GitHub



## 🏗️ Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │      Browser        │

&#x20;                   │   React Frontend    │

&#x20;                   │     Port 5173       │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │   Flask Backend     │

&#x20;                   │     Port 5000       │

&#x20;                   │    REST API + JWT   │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │    PostgreSQL       │

&#x20;                   │      Database       │

&#x20;                   │      Port 5432      │

&#x20;                   └─────────────────────┘

