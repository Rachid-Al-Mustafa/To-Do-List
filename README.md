# To-Do List Application

## Introduction

This To-Do List Application is designed to manage tasks efficiently with various roles and permissions. It includes features for user management, task management, and analytics. The application is built using Node.js with Express for the backend and Vite + React for the frontend.

## Features

- **User Authentication and Authorization**

  - Register and login functionality
  - JWT-based authentication

- **Roles and Permissions**

  - **Admin**:
    - Promote users to team leaders
    - Demote team leaders to users
    - Add, edit, delete tasks
  - **Team Leader**:
    - Add, edit, delete tasks
    - Cannot promote or demote users
  - **User**:
    - View tasks and analytics

- **Task Management**

  - Add, edit, delete tasks
  - View tasks in different states: all tasks, tasks in progress, and completed tasks

- **Analytics**
  - Track user actions (create, edit, in progress, complete, delete) on tasks
  - Display task analytics

## Project Structure

````plaintext
ToDo List/
├── client/
│   └── (Vite + React frontend files)
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── analyticsController.js
│   ├── models/
│   │   ├── userSchema.js
│   │   ├── taskSchema.js
│   │   └── userAnalyticsSchema.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── analyticsRoutes.js
│   ├── app.js
│   └── Dockerfile
└── .dockerignore
````

## Setup and Installation

### Prerequisites
- Node.js
- npm
- Docker

### Backend Setup
1. Navigate to the `server` directory:
   ```sh
   cd "ToDo List/server"

2. Install dependencies:
   ```sh
   npm install

3. Create a `.env` file based on the `.env.example` and configure your environment variables:
    ```sh
    SECRET_KEY=your_secret_key
    MONGODB_URI=your_mongodb_connection_string

4. Start the backend server:
   ```sh
   npm start
````
````
### Frontend Setup
1. Navigate to the `client` directory:
   ```sh
   cd "ToDo List/client"

2. Install dependencies:
   ```sh
   npm install

3. Start the frontend development server:
   ```sh
   npm run dev
````
````
### Docker Setup
1. Build the Docker image:
   ```sh
   docker build -t todo-list .

2. Run the Docker container:
   ```sh
   docker run -p 3000:3000 todo-list
````
````
## API Endpoints

### Authentication
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Logout**: `POST /api/auth/logout`

### User Management (Admin)
- **Promote User to Team Leader**: `PUT /api/user/change-role`
- **Demote Team Leader to User**: `PUT /api/user/change-role`

### Task Management
- **Add Task**: `POST /api/task/tasks`
- **Edit Task**: `POST /api/task/editTask/:id`
- **Delete Task**: `DELETE /api/task/task/:id`
- **Get All Tasks**: `GET /api/task/tasksList`

### Analytics
- **Post Action Made by User**: `POST /api/analytics/analytics`
- **Get Task Analytics**: `GET /api/analytics/analytics/task/:id`
- **Get User Analytics**: `GET /api/analytics/analytics/user/:id`
- **Get Tasks Analytics According To Their Action/Status**: `GET /api/analytics/tasksData`
- **Get User Analytics According To Their Action/Status**: `GET /api/analytics/usersData`

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.


## Contact
For any questions or support, please contact [rachidalmustafa377@gamil.com].
