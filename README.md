# 🎯 Task Board - Full Stack Application

A beautiful, responsive task management app built with FastAPI (Python) backend and React (Vite + Tailwind) frontend.

## ✨ Features

- ➕ Add, complete, and delete tasks
- 📊 Real-time progress tracking with visual progress bar
- 🎉 Celebration confetti animation when all tasks completed
- 💾 JSON file persistence
- 🎨 Beautiful gradient UI with Tailwind CSS
- ⚡ Fast and responsive

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- Pydantic for validation
- JSON file storage

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- canvas-confetti

## 🚀 Setup & Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
