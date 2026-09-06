# CollabBoard MongoDB Database

## Database

Database name: `CollabBoard`

The CollabBoard application uses MongoDB as its database and Mongoose as the Object Data Modeling (ODM) library for Node.js.

## Collections

The database contains two main collections:

### 1. users

The `users` collection stores registered user information.

Fields:

- `_id` - MongoDB unique identifier
- `name` - User's name
- `email` - User's email address
- `passwordHash` - Hashed user password
- `createdAt` - Account creation time
- `updatedAt` - Last update time

### 2. tasks

The `tasks` collection stores tasks created by users.

Fields:

- `_id` - MongoDB unique identifier
- `title` - Task title
- `column` - Task status: `todo`, `doing`, or `done`
- `tag` - Task category
- `description` - Task description
- `userId` - Reference to the user who owns the task
- `createdAt` - Task creation time
- `updatedAt` - Last update time

## Database Relationship

Each task is associated with a user through the `userId` field.

```text
User
  |
  | userId
  |
  v
Task