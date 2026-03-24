import { useState, useEffect, useCallback } from "react";
import type { Todo } from "./types";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import type { FilterType } from "./components/TodoFilter";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch {
      setError("ToDoの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreate = async (title: string, description: string) => {
    try {
      setError(null);
      const newTodo = await createTodo({ title, description });
      setTodos((prev) => [newTodo, ...prev]);
    } catch {
      setError("ToDoの作成に失敗しました。");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setError(null);
      const updated = await updateTodo(id, { completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("ToDoの更新に失敗しました。");
    }
  };

  const handleUpdate = async (id: string, title: string, description: string) => {
    try {
      setError(null);
      const updated = await updateTodo(id, { title, description });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("ToDoの更新に失敗しました。");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("ToDoの削除に失敗しました。");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-indigo-600">ToDo</span> App
          </h1>
          <p className="text-gray-500">Hono + React で作られたタスク管理アプリ</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Todo Form */}
        <TodoForm onSubmit={handleCreate} />

        {/* Filter */}
        <TodoFilter filter={filter} onFilterChange={setFilter} counts={counts} />

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-3">読み込み中...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {filter === "completed" ? "\uD83C\uDFAF" : filter === "active" ? "\uD83C\uDF89" : "\uD83D\uDCDD"}
            </div>
            <p className="text-gray-500">
              {filter === "completed"
                ? "完了済みのタスクはありません"
                : filter === "active"
                  ? "未完了のタスクはありません"
                  : "タスクがありません。上のフォームから追加しましょう！"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400">
          <p>Built with Hono + React + TailwindCSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;
