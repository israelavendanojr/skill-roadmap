# Skill Roadmap

A full-stack application built with React and Flask.

## Project Structure

```
skill-roadmap/
├── backend/       # Flask backend
└── frontend/      # React frontend
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- pip
- npm

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the example .env file and update it with your configuration:
   ```bash
   cp .env.example .env
   ```

5. Run the Flask application:
   ```bash
   python app.py
   ```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example .env file and update it with your configuration:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## Development

### Running the Application

1. Start the backend server (in one terminal):
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend development server (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

### Environment Variables

Backend (.env):
- `FLASK_APP`: Flask application module
- `FLASK_ENV`: Development environment
- `FLASK_DEBUG`: Debug mode
- `SECRET_KEY`: Application secret key
- `BACKEND_PORT`: Port for the Flask server

Frontend (.env):
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Development environment
- `REACT_APP_PORT`: Frontend port

## Deployment

### Backend

1. Create a production requirements file:
   ```bash
   pip freeze > requirements.txt
   ```

2. Create a production .env file:
   ```bash
   cp .env .env.production
   ```

3. Update the production .env file with production settings

### Frontend

1. Build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```

2. The production build will be in the `build` directory

## License

MIT
