# Support Ticket Application

## Summary

The Support Ticket Application is a web-based system designed to manage support tickets, facilitating communication and issue resolution between users and support agents. The application provides endpoints for creating, updating, and retrieving tickets, as well as managing comments and administrative tasks.

## Architecture

The application follows a microservices architecture, with each functional domain encapsulated in a separate service. These services include authentication, ticket management, comments, and administration. Although due to that this project is minimal and basic, the project was deployed as a monolithic application. Docker containers is used to deploy this app, promoting scalability and ease of deployment.

### Microservices

1. **Authentication Service**: Handles user authentication and authorization.
2. **Ticket Service**: Manages the creation, retrieval, and updating of support tickets.
3. **Comment Service**: Facilitates the creation and retrieval of comments on tickets.
4. **Admin Service**: Contains functionality for admin-specific actions, such as user management and ticket assignment.

### Technologies Used

- **Backend**: Node.js with Express.js for the server-side logic.
- **Database**: MongoDB for storing ticket and user data.
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication.
- **Containerization**: Docker and Docker Compose for packaging and deploying services.
- **Documentation**: Swagger for API documentation.

## Development Technologies

- **Language**: TypeScript for statically-typed JavaScript development.
- **Validation**: Express Validator for request validation.
- **Testing**: Jest for unit testing.
- **API Documentation**: Swagger for documenting and testing API endpoints.
- **Version Control**: Git for source code management.

## Readme Document

### 1. Prerequisites and Dependencies

Before installing the application, ensure you have the following prerequisites installed:

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) for containerization.

### 2. Database Initialization

The application uses MongoDB, and the database is automatically initialized when the Docker containers are started. The database is included in the Docker setup. It will be automatically initialized when running the Docker containers.

### 3. Assumptions

- Docker and Docker Compose are installed on the host machine.

### 4. Uncovered Requirements

No requirements have been left uncovered.

### 5. Source Code Configuration

1. Clone the repository:

   ```bash
   git clone <https://github.com/znuta/support-ticket.git>
   ```

# Navigate to the project directory:

cd support-ticket-app

# Create a .env file in the project root and configure necessary environment variables.

# Run tests

npm test

# Build and run the Docker containers.

docker-compose up --build

### Support ticket API Doc

1. Visit this provided swagger API doc:

   ```bash
    http://localhost:8000/api/v1/swagger/docs/
   ```

## Issues Faced

No significant issues were encountered during the development of the application.

## Constructive Feedback

The assignment was comprehensive and well-structured.

Feel free to reach out for any further clarification or assistance!
