# Default Auth System (Backend)

This repository contains code for a simple auth system made with NodeJS (ExpressJS).

---

# Tech Used

- NodeJS
- ExpressJS
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- MySQL (Connection with mysql2)

# Folder Structure

- Controllers
- Repositories
- Middlewares
- Routes
- Database
- Config
- Shared

# How to Run

 - Clone the Repository: git clone https://github.com/henriqfranco/default-auth-system.git
 - Go to the folder: cd default-auth-system
 - Install dependencies: npm install
 - Configure .env file based on .env.example
 - Create the database based on the .sql file
 - Initiate the server with: npm run dev

# Available Routes:

- /users (Gets all users)
- /user (Gets the currently logged in user)
- /register (Post request to register a new user)
- /login (Post request to login an existing user)
- /deactivate (Post request to deactivate the account of the user that is currently logged in)
- /reactivate (Post request to reactivate a deactivated account)
- /account (Delete request to delete the account of the user currently logged in)
- /username (Patch request to update the username of the user currently logged in)
- /email (Patch request to update the email of the user currently logged in)
- /fullname (Patch request to update the first or last name of the user currently logged in)
- /password (Patch request to update the password of the user currently logged in)

# Security:

- Passwords are encrypted with bcrypt
- Form validation is being done with middlewares for register and login
- Token validation also in middleware (All routes except for /reactivate)
