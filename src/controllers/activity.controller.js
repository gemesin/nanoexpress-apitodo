const ActivityModel = require('../models/activity.model');

class ActivityController {

  constructor() {
    this.activityCache = [];
    this.activityCacheByKey = [];
    this.lastActivityId = 0;
  }

  getAll = async (req, res) => {
    const { query } = req

    let params = {}

    if(query){
      params = query
    }
    
    // let list = await ActivityModel.find(params);

    let list = this.activityCache;

    return res.json({
      status: "Success",
      message: "Successfully retrieved activities",
      data: list
    });
  };

  getById = async (req, res) => {
    const { params } = req

    // const data = await ActivityModel.findOne({ id: params.id });

    const data = this.activityCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${params.id} Not Found`,
        data: {}
      });
    }

    return res.json({
      status: "Success",
      message: `Successfully retrieved activities with ID ${params.id}`,
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

    const { affectedRows, insertId } = await ActivityModel.create(body);

    // if (!affectedRows) {
    //   return res.status(500).json({
    //     status: "Internal Server Error",
    //     message: error.message,
    //   })
    // }

    // const data = await ActivityModel.findOne({ id: insertId });
    // if (!data) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Activity with ID ${insertId} Not Found`,
    //     data: {}
    //   });
    // }

    const activity = {
      id: this.lastActivityId + 1,
      email: body.email,
      title: body.title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.activityCache.push(activity)
    this.activityCacheByKey[activity.id] = activity

    const data = this.activityCacheByKey[activity.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${activity.id} Not Found`,
        data: {}
      });
    }

    this.lastActivityId++;

    res.status(201).json({
      status: "Success",
      message: "Successfully created activity",
      data
    });
  };

  update = async (req, res) => {
    const { body, params } = req

    if (!body.title || body.title.length <= 0) {
      return res.status(400).json({
        status: "Bad Request",
        message: "title cannot be null",
      })
    }

    // const { affectedRows } = await ActivityModel.update(body, params.id);

    // if (!affectedRows) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Activity with ID ${params.id} Not Found`,
    //     data: {}
    //   });
    // }

    const activity = {
      ...body,
      updated_at: new Date().toISOString()
    }
    const idx = this.activityCache.findIndex(a => a.id == params.id)
    this.activityCache[idx] = {...this.activityCache[idx], ...activity};
    this.activityCacheByKey[params.id] = {...this.activityCacheByKey[params.id], ...activity};

    // const data = await ActivityModel.findOne({ id: params.id });

    const data = this.activityCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${params.id} Not Found`,
        data: {}
      });
    }

    res.json({
      status: "Success",
      message: "Successfully updated activity",
      data
    });
  };

  remove = async (req, res) => {
    const { params } = req

    // const data = await ActivityModel.findOne({ id: params.id });

    const data = this.activityCacheByKey[params.id];

    if (!data) {
      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${params.id} Not Found`,
        data: {}
      });
    }

    const { affectedRows } = await ActivityModel.delete(params.id);

    // if (!affectedRows) {
    //   return res.status(404).json({
    //     status: "Not Found",
    //     message: `Activity with ID ${params.id} Not Found`,
    //     data: {}
    //   });
    // }

    const idx = this.activityCache.findIndex(a => a.id == params.id)
    this.activityCache.splice(idx, 1);
    this.activityCacheByKey.splice(params.id, 1);

    res.json({
      status: "Success",
      message: "Successfully deleted activity",
      data: {}
    });
  };
}

module.exports = new ActivityController;