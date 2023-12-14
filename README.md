# StealthNet server
StealthNet is a secure chat application designed to safeguard your privacy and security. Unlike other messaging apps, StealthNet is entirely free from invasive tracking and telemetry, ensuring that your conversations remain confidential and your data is not harvested for any purpose.

### Features
- User Authentication

## Tech Stack
StealthNet is built using Node.js and Express.js for the backend, and vanilla JavaScript for the frontend. It uses cryptedjsondb for secure data storage.

## Codebase Overview
The codebase is organized into several directories and files:

- user-api: Contains the routes and logic for user-related operations such as authentication, friend management, and messaging.
- utils: Contains utility functions for user and message management, analytics, and logging.
- public: Contains the frontend code for the application, including HTML, CSS, and JavaScript files.
- components: Contains the User and Message classes.

## Getting Started

To run StealthNet locally, you need to have Node.js installed. Then, follow these steps:

1. Clone the repository.
2. Run npm install to install the dependencies.
3. Create a .env file in the root directory and set the databaseKey variable.
4. Run node server.js to start the server.
## Contributing

Contributions are welcome! Please read the contributing guidelines before making any changes.
# License

StealthNet is licensed under the MIT License.