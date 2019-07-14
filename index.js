const express = require('express');
const server = express();
const PORT = 3000;

let projects = [];
let numberOfRequests = 0;

server.use(express.json());

// middlewares
const projectFind = (req, res, next) => {
  const { id } = req.params;
  const foundProject = projects.filter(project => project.id === id);

  if (foundProject.length <= 0) {
   return res.status(404).send('Project not found');
  }

  return next();
} 

const countRequisitions = (req, res, next) => {
  numberOfRequests ++;
  console.log(numberOfRequests);
  return next();
}

// listing projects
server.get('/projects', countRequisitions, (req, res) => {
  return res.send(projects);
});

// creating a new project
server.post('/projects', countRequisitions, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: [],
  }

  projects.push(project);

  return res.send(project);
})

server.post('/projects/:id/tasks', countRequisitions, projectFind, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(project => {
    if (project.id !== id) return;

    project.tasks.push(title);

    return res.send(project);
  })

  return;
})

// updating a project title
server.put('/projects/:id', countRequisitions, projectFind, (req, res) => {
  const { id: projectId } = req.params;
  const { title: newProjectTitle } = req.body;
  console.log(newProjectTitle);
  projects.forEach(project => {
    if (project.id !== projectId ) return;

    project.title = newProjectTitle;

    return res.send(project);
  })

  return;
})

// deleting a project
server.delete('/projects/:id', countRequisitions, projectFind, (req, res) => {
  const { id } = req.params;
  
  const remainingProjects = projects.filter(project => project.id !== id);

  projects = remainingProjects;

  return res.send('Project deleted sucessfully');
})



server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})