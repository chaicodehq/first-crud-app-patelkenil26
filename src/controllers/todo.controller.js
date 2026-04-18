import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const data = req.body;
    if (!data) {
      return res.status(400).json({ error: { message: "No data provided" } });
    }

    const todo = await Todo.create(data);

    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { completed, priority, search } = req.query;

    let filter = {};

    if (completed !== undefined) filter.completed = completed === "true";
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const todos = await Todo.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Todo.countDocuments(filter);

    return res.status(200).json({
      data: todos,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: { message: "No id provided" } });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;
    const data = req.body;

    if (!id || !data) {
      return res
        .status(400)
        .json({ error: { message: "no information provided" } });
    }

    const todo = await Todo.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: { message: "No id provided" } });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: { message: "No id provided" } });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
