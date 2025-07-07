# Smart To-Do List Application

This is a Smart To-Do List application that leverages AI-based task management features. Users can manage tasks, receive intelligent prioritization, get deadline suggestions, and benefit from context-aware recommendations.

## Tech Stack

*   **Backend:** Django REST Framework (Python)
*   **Frontend:** Next.js + Tailwind CSS
*   **Database:** Supabase (PostgreSQL) - *Note: Currently configured for SQLite, update settings for Supabase.*
*   **AI Integration:** Google Gemini Pro

## Project Structure

This project is a monorepo containing both the frontend and backend:

*   `./backend/`: Django Backend application
*   `./frontend/`: Next.js Frontend application

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-todo
```

### 2. Environment Setup

Create a `.env.local` file in the **root** of this project (`smart-todo/`) and add your Gemini API key and the frontend API base URL:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 3. Backend Setup (Django)

Navigate to the `backend` directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Apply database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend API will be accessible at `http://127.0.0.1:8000/api/`.

### 4. Frontend Setup (Next.js)

Open a **new terminal** and navigate to the `frontend` directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

## Important Notes

*   **Task Update**: The `TaskEditorPage` currently only implements `createTask`. For full update functionality, you would need to implement `updateTask` in `frontend/src/api/api.ts` and integrate it.
*   **Supabase Integration**: The backend is currently configured to use SQLite. For Supabase (PostgreSQL), you'll need to install `psycopg2-binary` and configure `DATABASES` in `backend/smart_todo_backend/settings.py` with your Supabase connection details.
*   **AI Suggestions**: The AI suggestions are powered by Google Gemini Pro. Ensure your `GEMINI_API_KEY` is correctly set in the `.env.local` file.
