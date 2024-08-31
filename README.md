# Realtime Chat App

A web based realtime chat application that allows users to send and receive encrypted messages. It utilizes Socket.io for real-time communication and CryptoJS for AES encryption.

### Technologies Used
#### Frontend:

- React

#### Backend:

- Node.js
- Express
- Socket.io

#### Encryption:
- CryptoJS (AES)

## Run Locally

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/UdayrajJhala/ChatApp.git
   cd ChatApp

2. **Set up the backend:**

- Install dependencies:

  ```bash
  npm install

3. **Setup the frontend**

- Navigate to the frontend directory and install dependencies:

  ```bash
  cd frontend
  npm install

4. **Configure environment variables:**
- Create a .env file in the frontend directory and add your encryption key:
  
   ```bash
   REACT_APP_ENCRYPTION_KEY=your-32-char-key-here

### Running the application

1. **Start the backend server**
    ```bash
    cd ../
    node server.js

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   
The app will run on http://localhost:3000.

Open this url in different browser windows and try chatting using them.


