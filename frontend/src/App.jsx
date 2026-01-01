import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

const API_BASE = '/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    const completedTasks = tasks.filter(t => t.completed).length
    const totalTasks = tasks.length
    
    if (totalTasks > 0 && completedTasks === totalTasks) {
      triggerConfetti()
    }
  }, [tasks])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`)
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError('Failed to fetch tasks')
    }
  }

  const addTask = async () => {
    if (!inputValue.trim()) {
      setError('Task cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const newTask = {
        id: Date.now(),
        title: inputValue.trim(),
        completed: false
      }

      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        setTasks([...tasks, newTask])
        setInputValue('')
      }
    } catch (err) {
      setError('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT'
      })

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: !task.completed }
            : task
        ))
      }
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId))
      }
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

      <div className="w-full max-w-3xl relative">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-3 tracking-wider" style={{fontFamily: 'Orbitron'}}>
            TASK BOARD
          </h1>
          <div className="flex items-center justify-center gap-3 text-cyan-300">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <p className="text-lg tracking-widest uppercase">Neural Productivity System</p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500/30 overflow-hidden">
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan"></div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-purple-500"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-purple-500"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500"></div>
          
          {/* Progress Section */}
          <div className="mb-8 relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-cyan-400 tracking-wider uppercase">
                System Progress
              </span>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {completedCount}/{totalCount} COMPLETED
              </span>
            </div>
            <div className="relative w-full h-4 bg-gray-950/50 rounded-full overflow-hidden border border-cyan-500/30">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none"></div>
            </div>
            <div className="text-right mt-2">
              <span className="text-xs text-cyan-300 font-mono">
                [{progressPercentage.toFixed(1)}%]
              </span>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8 relative z-10">
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Initialize new task..."
                  className="w-full px-5 py-4 bg-gray-950/50 border-2 border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/50 transition-all text-cyan-100 placeholder-gray-500 font-mono"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <button
                onClick={addTask}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider border border-cyan-400/50"
                style={{fontFamily: 'Orbitron'}}
              >
                {loading ? '...' : '+ ADD'}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2 font-mono flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </p>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-3 relative z-10">
            {tasks.length === 0 ? (
              <div className="text-center py-16 relative">
                <div className="text-6xl mb-4 opacity-30">⚡</div>
                <p className="text-gray-400 font-bold tracking-wider uppercase">No Active Tasks</p>
                <p className="text-gray-600 text-sm mt-2 font-mono">// Initiate your first mission above</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`group flex items-center gap-4 p-5 rounded-lg border-2 transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
                    task.completed 
                      ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50 hover:border-purple-400' 
                      : 'bg-gray-950/30 border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/50'
                  }`}
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    task.completed 
                      ? 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'
                      : 'bg-gradient-to-r from-cyan-500/5 to-blue-500/5'
                  }`}></div>

                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded cursor-pointer accent-cyan-500 border-2 border-cyan-500"
                    />
                  </div>
                  
                  <span
                    className={`flex-1 transition-all duration-300 font-mono text-lg relative z-10 ${
                      task.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-cyan-100 font-semibold'
                    }`}
                  >
                    {task.title}
                  </span>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-4 py-2 bg-red-900/30 hover:bg-red-800/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/50 uppercase text-xs font-bold tracking-wider"
                  >
                    DELETE
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-cyan-400/60 text-sm font-mono tracking-wider">
            [[ POWERED BY FASTAPI + REACT + TAILWIND ]]
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200vh); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default App
