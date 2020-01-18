const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.count('Número de requisições');

  return next();
});

function verifyProjectExists(req, res, next) {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  if (!projects[projectIndex]) {
    return res.status(404).json({ message: 'Project not found' });
  }

  req.project = projects[projectIndex];
  req.projectIndex = projectIndex;

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', verifyProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete('/projects/:id', verifyProjectExists, (req, res) => {
  const { id } = req.params;

  projects.splice(req.projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', verifyProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen('3000');
