# SkillMastery Backend

SkillMastery Express API is a server-side application built with Express.js for handling various operations related to tutors, learners, and admins. It is designed to work in conjunction with a React front-end and a MongoDB database.

## Getting Started

To get started with this project, you should follow these steps:

1. **Clone the repository:** 

git clone https://github.com/SimonChung2/SkillMastery-Node-Express-Mongo.git


2. **Install the required dependencies:**

npm install


3. **Set up your environment variables:**
Create a `.env` file in the root directory of the project and set the following environment variables:

DB_USER=your_db_user
DB_PWD=your_db_password
DB_HOST=your_db_host
VITE_CLIENT_URL=your_client_url
VITE_SERVER_URL=your_server_url


4. **Run the server:**

npm run dev


## Features

This API provides the following features:

- **Tutors**: CRUD operations for managing tutor information.
- **Learners**: CRUD operations for managing learner information.
- **Menu Links**: Retrieve and manage menu links.
- **Login and Logout**: User authentication and logout functionality.

## API Endpoints

The API endpoints are defined in the code, and you can find a detailed list in the source code. Here are some of the endpoints for your reference:

- `GET /tutors`: Get a list of all tutors.
- `POST /tutors/add/submit`: Create a new tutor.
- `GET /tutors/delete`: Delete a tutor.
- `GET /tutors/edit`: Edit a tutor.
- `POST /tutors/edit/submit`: Submit edited tutor information.
- `POST /tutor/login`: Log in as a tutor.
- `GET /logout`: Log out.

Similar endpoints exist for learners, admin, and menu links.

## Database

The API uses MongoDB as the database system. Ensure that you have MongoDB set up and configured correctly with the connection URL specified in the `.env` file.



