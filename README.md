# CodeSync - Backend - A Real-Time Code Mentoring Platform

<img src="public/img/code-icon.png"  width="250"  />

The backend of this application is built with **Node.js** and utilizes **MongoDB** for persistent data storage. It also integrates **Socket.IO** to enable real-time communication between users and mentors. The system is designed to efficiently handle dynamic interactions, such as updating blocks and managing real-time messaging, while ensuring smooth data management.

## Installation and Setup

### Clone the Repository

Clone the backend repository from GitHub:

```bash
git clone https://github.com/YiftachSamocha/codesync-backend.git
```

### Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
```

### Running the Server

The `server.js` file is the entry point for the backend application. Use the following command to start the server in both development and production environments:

```bash
npm start
```

**Visit the platform**: Open your browser and navigate to the following URL to access the app:
    [CodeSync - Live Platform](https://codesync-71hs.onrender.com)

## Features

### 1. **Block Service**

The `blockService` is responsible for managing block-related data:
- **Get Block by Type:** Retrieves a block based on its type from the MongoDB database. If no such block exists, it loads default block data from a JSON file and stores it in the database.
- **Update Block:** Allows updating the block's data within the MongoDB collection.
- **Data Creation:** If a block of a specified type is missing, it creates and inserts the default block data into MongoDB from a stored JSON file.

### 2. **Block Routes and Controller**

API routes are defined to facilitate interaction with the block data:
- **GET /:type:** Fetches a block based on its type, utilizing the `blockService` to retrieve the data.
- **PUT /:** Allows updating a block’s data by sending updated information to the server, which is then saved in the database.

### 3. **Socket Communication**

Real-time interaction is handled using **Socket.IO**, allowing users to dynamically interact with each other:
- **Block Type Management:** Users are assigned specific block types to join real-time rooms for interaction. Mentors and users communicate through these blocks, and real-time events help manage these interactions.
- **Event Handling:** Key events such as editing blocks, sending questions, and receiving answers are handled live, enabling fluid communication.

### 4. **MongoDB Integration**

**MongoDB** is used for data storage, providing flexibility with its NoSQL document structure. The backend stores and retrieves blocks and user interactions from the database.

### 5. **Node.js Framework**

The backend leverages **Node.js** with the **Express.js** framework for creating and managing the API endpoints. **Socket.IO** ensures real-time communication, supporting features such as block updates and live chat between users and mentors.

## Conclusion

The backend is designed to provide a robust foundation for dynamic user engagement, combining **Node.js**, **MongoDB**, and **Socket.IO** to deliver efficient data management and responsive, interactive communication. This setup ensures a seamless experience for both users and mentors.