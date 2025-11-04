# Instant Messenger

A real-time chat application built with a Node.js/TypeScript backend and a React frontend. It leverages Socket.IO for bi-directional communication, allowing users to join channels, send messages, and manage profiles seamlessly.

## 🚀 Features

* **Real-time Messaging:** Instant delivery of messages using Socket.IO.
* **Channels:** Create, join, and list chat channels.
* **User Profiles:** Register, login, and view user profiles.
* **Persistence:** Messages and user data stored in a database (e.g., MongoDB).
* **Responsive UI:** Built with Create React App and styled with SCSS modules.

## 📁 Project Structure

```
Instant-Messenger/
├── client/                  # React frontend
│   ├── public/              # Static files
│   ├── src/                 # React source code
│   │   ├── components/      # UI components
│   │   │   ├── chat/        # Chat interfaces (ChatWindow, ChannelModal)
│   │   │   ├── login/       # Login form
│   │   │   └── profile/     # User profile view
│   │   ├── App.js           # Root React component
│   │   └── index.js         # Frontend entry point
│   ├── package.json         # Frontend dependencies and scripts
│   └── README.md            # CRA-generated README
├── server/                  # Node.js/TypeScript backend
│   ├── src/                 # Server source code
│   │   ├── controllers/     # Route handlers for users, channels, messages
│   │   ├── models/          # Data models (User, Channel, Message)
│   │   ├── socketio.ts      # Socket.IO setup
│   │   └── index.ts         # Backend entry point
│   ├── tsconfig.json        # TypeScript configuration
│   ├── package.json         # Backend dependencies and scripts
│   └── .env                 # Environment variables (e.g., DB URI, PORT)
├── .gitignore               # Ignored files
└── README.md                # This file
```

## 🛠️ Technologies

* **Frontend:** React, Create React App, SCSS Modules
* **Backend:** Node.js, Express, TypeScript, Socket.IO
* **Database:** MongoDB (via Mongoose)
* **Tooling:** ESLint, Prettier, ts-node-dev

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/instant-messenger.git
   cd instant-messenger
   ```

2. **Setup the Server**

   ```bash
   cd server
   npm install
   # Create a .env file with your environment variables:
   #   MONGO_URI=<your-mongodb-uri>
   #   PORT=5000
   npm run dev
   ```

3. **Setup the Client**

   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` to use the application.

## 📝 API Endpoints

| Route                 | Method | Description                |
| --------------------- | ------ | -------------------------- |
| `/api/users/register` | POST   | Register a new user        |
| `/api/users/login`    | POST   | Login and retrieve JWT     |
| `/api/channels`       | GET    | Get list of channels       |
| `/api/channels`       | POST   | Create a new channel       |
| `/api/messages`       | GET    | Get messages for a channel |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

Please ensure your code follows existing style and includes tests where applicable.

## 📄 License

This project is licensed under the MIT License.