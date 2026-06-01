import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MainLayout from '@/layouts/MainLayout';
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

  
async function fetchTasks() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  } else {
    setTodos(data || []);
  }
}


  const [todos, setTodos] = useState<any[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

useEffect(() => {
  fetchTasks();
}, []);

const addTodo = async () => {
  if (!newTodoTitle.trim()) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Please login first");
    return;
  }

  const { error } = await supabase
    .from("tasks")
    .insert([
      {
        title: newTodoTitle,
        completed: false,
        priority: "medium",
        category: "General",
        user_id: user.id,
      },
    ]);

  if (error) {
    console.error(error);
  } else {
    setNewTodoTitle("");
    setShowAddForm(false);
    fetchTasks();
  }
};

  

  const toggleTodo = async (id: string) => {
  const todo = todos.find((t) => t.id === id);

  if (!todo) return;

  const { error } = await supabase
    .from('tasks')
    .update({
      completed: !todo.completed,
    })
    .eq('id', id);

  if (error) {
    console.error(error);
  } else {
    fetchTasks();
  }
};



  const deleteTodo = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
  } else {
    fetchTasks();
  }
};


  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-300 bg-red-950/40 border-red-800/50';
      case 'medium':
        return 'text-amber-200 bg-amber-950/35 border-amber-800/45';
      case 'low':
        return 'text-emerald-300 bg-emerald-950/35 border-emerald-800/45';
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

  const filterChip = (active: boolean) =>
    active
      ? 'bg-white/12 text-[#f0f0f8] border border-white/20 shadow-[0_0_20px_-8px_rgba(255,255,255,0.15)]'
      : 'bg-white/[0.04] text-[#8888a0] border border-white/10 hover:bg-white/[0.08] hover:text-[#c8c8dc]';

  return (
    
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1>To-Do List</h1>
        <p className="text-muted-foreground mt-2">Organize your tasks and stay on track</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Total Tasks</p>
          <p className="text-3xl mt-1">{stats.total}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Active</p>
          <p className="text-3xl mt-1 text-[#e0e0ee]">{stats.active}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-muted-foreground text-sm">Completed</p>
          <p className="text-3xl mt-1 text-emerald-400/90">{stats.completed}</p>
        </div>
      </div>

      {/* Add Todo Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/15 rounded-xl hover:border-white/30 hover:bg-white/[0.04] transition-colors text-[#c8c8dc]"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      )}

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="glass-panel rounded-xl p-6 mb-6">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            autoFocus
            className="glass-input mb-4"
          />
          <div className="flex gap-2">
            <button type="button" onClick={addTodo} className="btn-primary">
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewTodoTitle('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg transition-colors border ${filterChip(filterStatus === 'all')}`}
        >
          All ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('active')}
          className={`px-4 py-2 rounded-lg transition-colors border ${filterChip(filterStatus === 'active')}`}
        >
          Active ({stats.active})
        </button>
        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg transition-colors border ${filterChip(filterStatus === 'completed')}`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`glass-panel rounded-xl p-4 hover:border-white/20 transition-all ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button type="button" onClick={() => toggleTodo(todo.id)} className="mt-1 flex-shrink-0">
                {todo.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400/90" />
                ) : (
                  <Circle className="w-6 h-6 text-[#5c5c70] hover:text-[#b8b8cc] transition-colors" />
                )}
              </button>

              <div className="flex-1">
                <p className={`mb-2 ${todo.completed ? 'line-through text-muted-foreground' : 'text-[#e8e8f2]'}`}>
                  {todo.title}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(todo.priority)}`}>
                    {todo.priority.toUpperCase()}
                  </span>

                  <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white/[0.06] text-[#a8a8b8] rounded border border-white/8">
                    <Tag className="w-3 h-3" />
                    {todo.category}
                  </span>

                  {todo.dueDate && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white/[0.06] text-[#b0b0c4] rounded border border-white/8">
                      <Calendar className="w-3 h-3" />
                      {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="p-2 hover:bg-red-950/40 rounded-lg transition-colors group"
              >
                <Trash2 className="w-5 h-5 text-[#5c5c70] group-hover:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-[#5c5c70] mx-auto mb-4" />
          <p className="text-muted-foreground">
            {filterStatus === 'completed' ? 'No completed tasks yet' : 'No tasks to show'}
          </p>
        </div>
      )}
    </div>
    
  );
}
