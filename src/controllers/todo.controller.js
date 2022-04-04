const TodoModel = require('../models/todo.model');

class TodoController {

  constructor() {
    this.todoCache = [];
    this.todoCacheByKey = [];
    this.lastTodoId = 0;
  }

  getAll = async (req, res) => {
    const { query } = req

    // let list = await TodoModel.find(query);

    let list = this.todoCache.filter(todo => { return todo.activity_group_id === query.activity_group_id });

    return res.json({
      status: "Success",
      message: "Successfully retrieved todos",
      data: list
    });
  };

  getById = async (req, res) => {
    const { params } = req

    // const data = await TodoModel.findOne({ id: params.id });

    const data = this.todoCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Todo with ID ${params.id} Not Found`,
        data: {}
      });
    }

    return res.json({
      status: "Success",
      message: `Successfully retrieved todos with ID ${params.id}`,
      data
    });
  };

  create = async (req, res) => {
    const { body } = req

    if (!body.title || body.title.length <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        message: "title cannot be null",
      })
    }

    if (!body.activity_group_id || body.activity_group_id.length <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        message: 'activity_group_id cannot be null',
      })
    }

    body.is_active = body.is_active ? body.is_active : 1;
    body.priority = body.priority ? body.priority : 'very-high';

    const { affectedRows, insertId } = await TodoModel.create(body);

    // if (!affectedRows) {
    //   return res.status(500).json({
    //     status: "Internal Server Error",
    //     message: error.message,
    //   })
    // }

    // const data = await TodoModel.findOne({ id: insertId });

    // if (!data) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Todo with ID ${insertId} Not Found`,
    //     data: {}
    //   });
    // }

    const todo = {
      id: this.lastTodoId + 1,
      activity_group_id: body.activity_group_id,
      title: body.title,
      is_active: body.is_active,
      priority: body.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.todoCache.push(todo)
    this.todoCacheByKey[todo.id] = todo

    const data = this.todoCacheByKey[todo.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${todo.id} Not Found`,
        data: {}
      });
    }

    data.is_active = data.is_active == 1 ? true : false;

    this.lastTodoId++;

    res.status(201).json({
      status: "Success",
      message: "Successfully created todo",
      data
    });
  };

  update = async (req, res) => {
    const { body, params } = req

    const { affectedRows } = await TodoModel.update(body, params.id);

    // if (!affectedRows) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Todo with ID ${params.id} Not Found`,
    //     data: {}
    //   });
    // }
    
    const todo = {
      ...body,
      updated_at: new Date().toISOString()
    }
    const idx = this.todoCache.findIndex(a => a.id == params.id)
    this.todoCache[idx] = {...this.todoCache[idx], ...todo};
    this.todoCacheByKey[params.id] = {...this.todoCacheByKey[params.id], ...todo};
    
    // const data = await TodoModel.findOne({ id: params.id });

    const data = this.todoCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Todo with ID ${params.id} Not Found`,
        data: {}
      });
    }
    
    res.json({
      status: "Success",
      message: "Successfully updated todo",
      data
    });
  };

  remove = async (req, res) => {
    const { params } = req

    // const data = await TodoModel.findOne({ id: params.id });

    const data = this.todoCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Todo with ID ${params.id} Not Found`,
        data: {}
      });
    }

    const { affectedRows } = await TodoModel.delete(params.id);

    // if (!affectedRows) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Todo with ID ${params.id} Not Found`,
    //     data: {}
    //   });
    // }

    const idx = this.todoCache.findIndex(a => a.id == params.id)
    this.todoCache.splice(idx, 1);
    this.todoCacheByKey.splice(params.id, 1);

    res.json({
      status: "Success",
      message: "Successfully deleted todo",
      data: {}
    });
  };
}

module.exports = new TodoController;