# Multilingual File Manager Application

## Project Overview

Create a multi-user file manager application using Node.js, Redis, and MySQL. Key features include:

- **User Management**: Facilitate user registration and login with secure password encryption.
- **File Management**: Provide CRUD operations for files within a user's directory structure.
- **Multilingual Support (i18n)**: Offer user interface elements (labels, messages) in various languages based on user preferences.
- **Queuing System**: Use Redis to implement a queue for asynchronous tasks like file uploads or conversions, with optional progress tracking.
- **Unit Testing**: Develop unit tests for core functionalities, including user registration, file management operations, and possibly the queuing system.

## Technical Details

**Databases**:

- **MySQL**: Store user information, file metadata (name, size, type, etc.), and directory structures.
- **Redis**: Use for queuing asynchronous tasks, utilizing libraries like Bull or Agenda.js.

**Node.js Framework**: Use a lightweight framework such as Express.js for structuring the application.

**Authentication**: Use a secure hashing algorithm (e.g., bcrypt) for password storage. Consider using Passport.js for user authentication.

**i18n Libraries**: Explore libraries like i18next for managing and implementing multilingual functionalities.

**Testing Framework**: Use a popular testing framework like Jest or Mocha for unit testing.

## How to Run

```bash
# Install dependencies
npm install
# Run docker-compose
# !!!Make sure you have docker-compose installed
docker-compose up -d
# Run the application
npm run dev
