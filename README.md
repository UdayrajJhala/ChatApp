# QuickChat

A web based real-time chat application with that allows users to create or join chat rooms and send or receive encrypted messages. It utilizes Socket.io for real-time communication and CryptoJS for AES encryption.

## Check it out!
The app is deployed with the help of render (backend server) and vercel (frontend)
<br>
Its live on https://quickkchat.vercel.app/ <br><br>
As the server is deployed on the free plan of render which turns off the server on inactivity, it may take around a minute to start and accept requests from the frontend<br><br>
Feedback is highly appreciated!
<hr>


### Future
As of now, I have developed only the bare minimum functionality.<br>
I will work on implementing featuers like authorization, storage of messages in a database (to fetch the previous ones), etc. <br>


### Technologies Used
#### Frontend:

- React

#### Backend:

- Node.js
- Express
- Socket.io

#### Encryption:
- CryptoJS (AES)

#### Deployment:

- Frontend : Vercel
- Backend : Render

## Run Locally

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/UdayrajJhala/QuickChat.git
   cd QuickChat

2. **Set up the backend:**

- Install dependencies:

  ```bash
  npm install

- In server.js, set the CORS origin url to the frontend url
    ```bash
    const io = new Server(server, {
       cors: {
          origin: "your-frontend-url-here",
          methods: ["GET", "POST"],
       },
    });


3. **Setup the frontend**

- Navigate to the frontend directory and install dependencies:

  ```bash
  cd frontend
  npm install

4. **Configure environment variables:**
- Create a .env file in the frontend directory and add your encryption key:
  
   ```bash
   REACT_APP_ENCRYPTION_KEY=your-32-char-key-here
   REACT_APP_BACKEND_URL=your-localhost-url-here


### Running the application

1. **Start the backend server**
    ```bash
    cd ../
    node server.js

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   
Open this url in different browser windows and try chatting using them.


