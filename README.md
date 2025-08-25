# E-commerce Support Chatbot

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-brightgreen?style=for-the-badge)](https://my-chatbot-frontend-pshg.onrender.com/)

An intelligent AI-powered support chatbot for e-commerce platforms, built with React, FastAPI, and Docker.

## 🌐 Live Demo

**Try it now:** [https://my-chatbot-frontend-pshg.onrender.com/](https://my-chatbot-frontend-pshg.onrender.com/)

### How to Use
1. Login with your email or user ID
2. Start a new chat session
3. Ask questions about orders, products, or account info
4. Get instant AI-powered responses

## ✨ Features

- 🤖 AI-powered customer support using GROQ API
- 👤 User authentication with email/ID login
- 💬 Real-time chat with session management
- 📊 Order status lookup and product recommendations
- 🔄 Conversation history and multi-session support
- 📱 Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **AI:** GROQ API for intelligent responses  
- **Deployment:** Render.com (Frontend + Backend)
- **Containerization:** Docker + Docker Compose

## 🚀 Deployment

- **Frontend:** Deployed on Render as Static Site
- **Backend:** Deployed on Render as Web Service
- **Database:** SQLite with CSV data import
- **Environment:** Production-ready with environment variables

## 📞 Contact

Built by [Prince Kumar] - [princekr7331@gmail.com]

⭐ Star this repo if you found it helpful!

---


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Automated customer query handling
- Order status lookup
- Product recommendations
- Multi-language support (extendable)
- Easy integration with ecommerce platforms
- Scalable, containerized deployment
- Customizable responses and workflows

## Tech Stack

- **Frontend:** JavaScript (React, Vite)
- **Backend:** Python (Flask/FastAPI, customizable)
- **Containerization:** Docker
- **Other:** Node.js, ESLint, Plugins

Language composition:
- JavaScript: 65.8%
- Python: 31%
- Dockerfile: 1.6%
- Other: 1.6%

## Project Structure

```
├── frontend/        # React + Vite frontend
│   └── README.md    # Frontend setup instructions
├── backend/         # Python backend (Flask/FastAPI)
├── docker/          # Docker-related files
├── .env.example     # Example environment variables
├── package.json     # Frontend dependencies
├── requirements.txt # Backend dependencies
├── Dockerfile       # Main Dockerfile
├── README.md        # This file
└── ...
```

## Installation

### Prerequisites

- Node.js & npm
- Python 3.8+
- Docker (optional, for containerized deployment)

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Princekr007/ecommerce-support-chatbot.git
cd ecommerce-support-chatbot
```

#### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

#### 3. Install backend dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

#### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in required values.

#### 5. Run with Docker (recommended)

```bash
docker-compose up --build
```

#### 6. Manual Run (development)

- Start backend:  
  ```bash
  python app.py
  ```
- Start frontend:  
  ```bash
  cd frontend
  npm run dev
  ```

## Usage

- Access the chatbot via the web interface (default: `http://localhost:3000`)
- Integrate with your ecommerce platform via API (see backend docs)
- Customize responses and workflows in backend scripts

## Customization

- **Frontend:** Modify React components in `frontend/`
- **Backend:** Update Python modules in `backend/` for new business logic or integrations
- **Docker:** Adjust Dockerfile and `docker-compose.yml` as needed
- **Environment Variables:** Use `.env` for secrets and configuration

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

## Contact

Maintainer: [Princekr007](https://github.com/Princekr007)

For questions, issues, or feature requests, please open an issue or contact via GitHub.
