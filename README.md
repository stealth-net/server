# StealthNet
StealthNet is a secure chat application designed to safeguard your privacy and security. Unlike other messaging apps, StealthNet is entirely free from invasive tracking and telemetry, ensuring that your conversations remain confidential and your data is not harvested for any purpose.  

## Tech Stack
StealthNet is built using Node.js and Express.js for the backend, and vanilla JavaScript for the frontend. It uses [cryptedjsondb](https://www.npmjs.com/package/cryptedjsondb) for secure data storage.

## Codebase Overview
The codebase is organized into several directories and files:

- [user-api](https://github.com/stealth-net/server/tree/main/user-api): Contains the routes and logic for user-related operations such as authentication, friend management, and messaging.
- [utils](https://github.com/stealth-net/server/tree/main/utils): Contains utility functions for user and message management, analytics, and logging.
- [public](https://github.com/stealth-net/server/tree/main/public): Contains the frontend code for the application, including HTML, CSS, and JavaScript files.
- [components](https://github.com/stealth-net/server/tree/main/components): Contains essential classes that play a crucial role in the functionality of StealthNet. These classes are responsible for managing and organizing core elements of the application.

## Getting Started
Getting started with StealthNet is a straightforward process, ensuring that you can quickly set up and enjoy a secure messaging experience. Follow these steps to get up and running:

### Clone the Repository
Start by cloning the StealthNet repository to your local machine. Open a terminal and run the following command:
```bash
git clone https://github.com/stealth-net/server.git
```
### Install Dependencies
Navigate to the project's root directory and install the necessary dependencies using npm (Node Package Manager). Run the following command:

```bash
cd server
npm install
```

### Set Up Environment Variables
Create a .env file in the root directory to store environment variables. These variables include sensitive information like the database key. Open the .env file in a text editor and add the following:
```plaintext
databaseKey=yourSecretKey
```
Replace yourSecretKey with a strong and secure key for database encryption.

### Start the Server
Run the following command to start the StealthNet server:
```bash
node server.js
```

### Access StealthNet Locally
Open your web browser and go to http://localhost:3000. You should see the StealthNet login page.

## Hosting Flexibility with StealthNet
One of the standout features of StealthNet is its exceptional hosting flexibility, allowing users to deploy and host the application effortlessly. Unlike many messaging apps that tie users to specific hosting platforms, StealthNet's architecture is designed for universal compatibility.

Whether you prefer to host it on your private server, a cloud service provider of your choice, or even on a local machine, StealthNet offers the freedom to decide where and how you want to run your secure chat application. This flexibility not only empowers users to take full control of their data but also makes the setup process straightforward for anyone, regardless of their technical expertise.

By embracing this hosting agnosticism, StealthNet ensures that users have the autonomy to tailor their chat experience to their specific needs and preferences, further solidifying its commitment to user privacy and security.

## Contributing
StealthNet thrives on collaboration and welcomes contributions from the open-source community. The codebase is open for inspection and improvement, encouraging developers to actively participate in enhancing the application's features and security measures. This collaborative spirit not only ensures a constantly evolving and improving platform but also fosters a community dedicated to the principles of privacy and data security.

## Logo
#### Currently we are using a logo similar to the old [Linkin Park](https://en.wikipedia.org/wiki/Linkin_Park) logo. If you are a member of the rock band, please contact us by mail with a request to change the logo: scar17off@gmail.com