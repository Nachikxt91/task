from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from typing import List, Optional

app = FastAPI()

# CORS configuration - allows frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

class TaskUpdate(BaseModel):
    completed: bool

# File storage
TASKS_FILE = "backend/tasks.json"

def load_tasks() -> List[dict]:
    """Load tasks from JSON file"""
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_tasks(tasks: List[dict]) -> None:
    """Save tasks to JSON file"""
    os.makedirs(os.path.dirname(TASKS_FILE), exist_ok=True)
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f, indent=2)

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Task Board API is running"}

@app.get("/api/tasks")
async def get_tasks():
    """Get all tasks"""
    return load_tasks()

@app.post("/api/tasks")
async def add_task(task: Task):
    """Add a new task"""
    tasks = load_tasks()
    tasks.append(task.dict())
    save_tasks(tasks)
    return task

@app.put("/api/tasks/{task_id}")
async def toggle_task(task_id: int):
    """Toggle task completion status"""
    tasks = load_tasks()
    task_found = False
    
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = not task['completed']
            task_found = True
            break
    
    if not task_found:
        raise HTTPException(status_code=404, detail="Task not found")
    
    save_tasks(tasks)
    return {"message": "Task updated", "task_id": task_id}

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    """Delete a task"""
    tasks = load_tasks()
    initial_length = len(tasks)
    tasks = [t for t in tasks if t['id'] != task_id]
    
    if len(tasks) == initial_length:
        raise HTTPException(status_code=404, detail="Task not found")
    
    save_tasks(tasks)
    return {"message": "Task deleted", "task_id": task_id}

@app.delete("/api/tasks")
async def clear_all_tasks():
    """Clear all tasks"""
    save_tasks([])
    return {"message": "All tasks cleared"}
