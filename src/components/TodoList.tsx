import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Tag } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'Complete Calculus Assignment Chapter 5', completed: false, priority: 'high', dueDate: '2025-12-08', category: 'Mathematics' },
    { id: '2', title: 'Read Physics Chapter 12-15', completed: false, priority: 'medium', dueDate: '2025-12-10', category: 'Physics' },
    { id: '3', title: 'Review Chemistry Lab Notes', completed: true, priority: 'low', category: 'Chemistry' },
    { id: '4', title: 'Prepare presentation for Biology', completed: false, priority: 'high', dueDate: '2025-12-07', category: 'Biology' },
    { id: '5', title: 'Practice coding problems', completed: false, priority: 'medium', category: 'Computer Science' },
  ]);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: newTodoTitle,
        completed: false,
        priority: 'medium',
        category: 'General',
      };
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === 'active') return !todo.completed;
    if (filterStatus === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1>To-Do List</h1>
        <p className="text-gray-600 mt-2">Organize your tasks and stay on track</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Total Tasks</p>
          <p className="text-3xl mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl mt-1 text-purple-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl mt-1 text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Add Todo Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      )}

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            autoFocus
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex gap-2">
            <button
              onClick={addTodo}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Task
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewTodoTitle('');
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button onClick={() => toggleTodo(todo.id)} className="mt-1 flex-shrink-0">
                {todo.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-purple-600" />
                )}
              </button>

              <div className="flex-1">
                <p className={`mb-2 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.title}
                </p>
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(todo.priority)}`}>
                    {todo.priority.toUpperCase()}
                  </span>
                  
                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    <Tag className="w-3 h-3" />
                    {todo.category}
                  </span>
                  
                  {todo.dueDate && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                      <Calendar className="w-3 h-3" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {filterStatus === 'completed' ? 'No completed tasks yet' : 'No tasks to show'}
          </p>
        </div>
      )}
    </div>
  );
}
