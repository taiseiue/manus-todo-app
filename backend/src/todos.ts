import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import db from "./db.js";

const todos = new Hono();

// Types
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: number;
  created_at: string;
  updated_at: string;
}

interface CreateTodoBody {
  title: string;
  description?: string;
}

interface UpdateTodoBody {
  title?: string;
  description?: string;
  completed?: boolean;
}

// GET /api/todos - Get all todos
todos.get("/", (c) => {
  const rows = db.prepare("SELECT * FROM todos ORDER BY created_at DESC").all() as Todo[];
  const result = rows.map((row) => ({
    ...row,
    completed: Boolean(row.completed),
  }));
  return c.json(result);
});

// GET /api/todos/:id - Get a single todo
todos.get("/:id", (c) => {
  const id = c.req.param("id");
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo | undefined;
  if (!row) {
    return c.json({ error: "Todo not found" }, 404);
  }
  return c.json({ ...row, completed: Boolean(row.completed) });
});

// POST /api/todos - Create a new todo
todos.post("/", async (c) => {
  const body = await c.req.json<CreateTodoBody>();

  if (!body.title || body.title.trim() === "") {
    return c.json({ error: "Title is required" }, 400);
  }

  const id = uuidv4();
  const title = body.title.trim();
  const description = (body.description || "").trim();

  db.prepare(
    "INSERT INTO todos (id, title, description) VALUES (?, ?, ?)"
  ).run(id, title, description);

  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
  return c.json({ ...row, completed: Boolean(row.completed) }, 201);
});

// PUT /api/todos/:id - Update a todo
todos.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<UpdateTodoBody>();

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo | undefined;
  if (!existing) {
    return c.json({ error: "Todo not found" }, 404);
  }

  const title = body.title !== undefined ? body.title.trim() : existing.title;
  const description = body.description !== undefined ? body.description.trim() : existing.description;
  const completed = body.completed !== undefined ? (body.completed ? 1 : 0) : existing.completed;

  if (title === "") {
    return c.json({ error: "Title cannot be empty" }, 400);
  }

  db.prepare(
    "UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, description, completed, id);

  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
  return c.json({ ...row, completed: Boolean(row.completed) });
});

// DELETE /api/todos/:id - Delete a todo
todos.delete("/:id", (c) => {
  const id = c.req.param("id");

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id) as Todo | undefined;
  if (!existing) {
    return c.json({ error: "Todo not found" }, 404);
  }

  db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  return c.json({ message: "Todo deleted successfully" });
});

export default todos;
