# Socket.IO Projects

This repository contains two real-time web application projects built with **Socket.IO**. Each project demonstrates how WebSockets can be used to create interactive, live experiences on the web.

## Projects

### 1. Tic-Tac-Toe

A classic multiplayer Tic-Tac-Toe (XO) game built with Socket.IO. Two players can join and play in real-time. The game state is synchronized between clients via WebSockets.

🔗 **Live Demo**: https://tictacfun.reza-derakhshan.ir/  

### 2. WhatsApp Clonner

A simple real-time chat application inspired by WhatsApp. Users can join and send messages instantly. Messages are transmitted using Socket.IO and rendered using EJS templates.

🔗 **Live Demo**: _Coming soon_  

### 3. Kingdom

In this simple yet strategic multiplayer game, players begin by choosing a country to represent. Once everyone has joined, the game starts, and diplomacy takes center stage. Players must negotiate, form alliances, and strategize to vote one country out of the game each round. In the end, the player whose country has accumulated the most wealth emerges as the ultimate winner.

🔗 **Live Demo**: https://kingdom.liara.run 

## Getting Started

Follow these steps to run either project locally:

### 1. Clone the repository

```bash
git clone https://github.com/rezadrakhshan/Socket.io-projects.git
cd Socket.io-projects
```

### 2. Navigate to the desired project

```bash
cd Tic-Tac-Toe
# or
cd WhatsAppClonner
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

### 5. Open your browser

Visit `http://localhost:3000` to view the app.

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- HTML, CSS, JavaScript
- EJS (for WhatsApp Clonner)

## License

This project is licensed under the [MIT License](LICENSE).
