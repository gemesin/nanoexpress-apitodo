const nanoexpress = require('nanoexpress')
const bodyParser = require('@nanoexpress/middleware-body-parser/cjs')
const dotenv = require('dotenv');

const activityController = require('./controllers/activity.controller');
const todoController = require('./controllers/todo.controller');

const app = nanoexpress()

dotenv.config();

app.use(bodyParser())

const port = Number(process.env.PORT || 3030);

app.get('/', (req, res) => {
  return res.json({
      status: "Success",
      message: "API is working",
    })
})

app.get('/activity-groups', activityController.getAll);
app.get('/activity-groups/:id', activityController.getById);
app.post('/activity-groups', activityController.create);
app.patch('/activity-groups/:id', activityController.update);
app.del('/activity-groups/:id', activityController.remove);

app.get('/todo-items', todoController.getAll);
app.get('/todo-items/:id', todoController.getById);
app.post('/todo-items', todoController.create);
app.patch('/todo-items/:id', todoController.update);
app.del('/todo-items/:id', todoController.remove);

app.setNotFoundHandler((req, res) => {
  return res.status(404)
    .json({
      status: "Not Found",
      message: "Page not found"
    })
})

app.listen(port, '0.0.0.0')

module.exports = app;