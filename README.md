# Ceylon Travelgine

A comprehensive, AI-powered travel and tourism platform for Sri Lanka, featuring a full-stack web application, intelligent recommendation engines, and advanced analytics for tourists, guides, vendors, and administrators.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [AI/ML Models & Services](#aiml-models--services)
- [Folder Structure](#folder-structure)
- [Software Engineering Practices](#software-engineering-practices)
  - [SOLID Principles](#solid-principles)
  - [Design Patterns](#design-patterns)
  - [Software Architecture](#software-architecture)
  - [OOP Practices](#oop-practices)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Project Overview
Ceylon Travelgine is a modern travel platform that connects tourists, guides, and vendors, providing:
- Personalized tour planning
- Marketplace for products and services
- AI-powered chatbots and recommendation engines
- Admin dashboard with analytics and management tools

## Features
- User authentication (tourist, guide, vendor, admin)
- Tour package management and booking
- Product marketplace with cart and checkout
- Blog and content management
- AI chatbot for travel assistance
- Landmark recognition and itinerary recommendation (ML/DL)
- Vendor and tourist demand forecasting (ML/DL)
- Admin analytics dashboard

## System Architecture
- **Frontend:** React (Vite), Tailwind CSS, Chart.js, SPA with role-based routing
- **Backend:** Node.js, Express, MongoDB (Mongoose), RESTful API, modular monolith
- **AI/ML Services:** Python (Flask/FastAPI), TensorFlow, scikit-learn, fastai, joblib, deployed as microservices
- **Deployment:** GitHub, LFS for large files, Docker-ready structure

```
[Frontend SPA] <-> [Node.js/Express API] <-> [MongoDB]
                                 |
                                 v
                    [AI/ML Microservices (Python)]
```

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Chart.js, React Router
- **Backend:** Node.js, Express, Mongoose, JWT, Multer
- **Database:** MongoDB Atlas
- **AI/ML:** Python, TensorFlow, Keras, scikit-learn, fastai, joblib
- **DevOps:** Git, GitHub, Git LFS, Docker (optional)

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/sanjayahewage0103/ceylone-travelgine.git
   cd ceylone-travelgine
   ```
2. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```
3. **Install frontend dependencies:**
   ```sh
   cd ../frontend
   npm install
   ```
4. **Install AI/ML service dependencies:**
   - Each AI service (in `ai-service/` and `ml-pipeline/`) has its own requirements.txt or environment.yml
   - Example:
     ```sh
     cd ../../ml-pipeline/landmark_identify
     pip install -r requirements.txt
     ```
5. **Set up environment variables:**
   - Copy `.env.example` to `.env` in backend and fill in required values
6. **Run the backend:**
   ```sh
   cd backend
   npm run dev
   ```
7. **Run the frontend:**
   ```sh
   cd ../frontend
   npm run dev
   ```
8. **Run AI/ML services:**
   - Start each Python service as needed (see their respective README or app.py)

## Usage Guide
- Access the frontend at `http://localhost:5173`
- Use different roles to explore tourist, guide, vendor, and admin features
- Admin dashboard: analytics, user/product management
- Try the AI chatbot and landmark recognition features

## AI/ML Models & Services
- **Landmark Recognition:** EfficientNetB0 (transfer learning, TensorFlow/Keras)
- **Tourist Demand Forecasting:** LSTM/GRU, XGBoost, scikit-learn
- **Vendor Demand Forecasting:** CatBoost, LightGBM, XGBoost
- **Smart Tour Planner:** Sequence modeling, collaborative filtering, Keras
- **Chatbot:** fastai AWD-LSTM, intent classification
- **Model files:** Tracked with Git LFS (`.keras`, `.tflite`, `.npy`, `.pkl`, etc.)

## Folder Structure
```
ceylone-travelgine/
├── ai-service/           # Python microservices for AI/ML
├── backend/              # Node.js/Express backend
├── frontend/             # React frontend
├── ml-pipeline/          # ML notebooks, models, datasets
├── uploads/              # Uploaded images/files
├── .gitattributes        # Git LFS tracking
├── .gitignore
├── package.json
└── README.md
```

## Software Engineering Practices
### SOLID Principles
- **Single Responsibility:** Each controller, service, and model has a focused responsibility (e.g., `auth.controller.js`, `order.service.js`).
- **Open/Closed:** New features (routes, models, ML services) can be added without modifying existing code.
- **Liskov Substitution:** OOP inheritance in Python ML services and JS classes follows substitutability.
- **Interface Segregation:** Service and controller interfaces are kept minimal and focused.
- **Dependency Inversion:** Backend uses dependency injection for services; Python ML code uses abstract base classes for model wrappers.

### Design Patterns
- **MVC (Model-View-Controller):** Used in backend (Express) and frontend (React components/pages).
- **Factory Pattern:** Used in backend factories (e.g., `user.factory.js`) and ML model loaders.
- **Singleton Pattern:** Database connection (MongoDB) and some service initializations.
- **Observer/Callback:** Event-driven callbacks in backend and ML training.

### Software Architecture
- **Modular Monolith:** Node.js backend is modular, with clear separation of concerns.
- **Microservices:** AI/ML services are decoupled Python microservices, communicating via REST APIs.
- **Layered Architecture:** Controllers, services, models, and routes are separated in backend.

### OOP Practices
- **Backend:** Uses JS classes for models, services, and middleware.
- **AI/ML Services:** Python classes for model wrappers, data loaders, and service endpoints.
- **Encapsulation, Inheritance, Polymorphism:** Applied in both backend and ML code for maintainability and extensibility.

## Contribution Guidelines
1. Fork the repository and create a new branch for your feature or bugfix.
2. Follow code style guidelines (ESLint for JS, PEP8 for Python).
3. Write clear commit messages and document your code.
4. Submit a pull request with a detailed description.

## License
This project is licensed under the MIT License.

## Acknowledgments
- Open source libraries and frameworks (React, Express, TensorFlow, fastai, etc.)
- Contributors and the open source community
- Data sources for Sri Lankan tourism and locations
