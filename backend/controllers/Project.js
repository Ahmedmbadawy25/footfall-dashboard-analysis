const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { projectName: projectName, logoUrl, tagline } = req.body;

  if (!projectName) {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const project = await Project.create({
      user: req.user.id,
      projectName: projectName,
      logoUrl,
      tagline,
    });

    res.status(201).json(project);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: 'Project name already in use, please choose a different project name' });
    }

    res.status(500).json({ message: 'An error occurred while creating the project' });
  }
});

// @desc    Get all projects by user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user.id });

  if (!projects || projects.length === 0) {
    return res.status(404).json({ message: 'No projects found' });
  }

  res.status(200).json(projects);
});

// @desc    Update Project Details
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { projectName, logoUrl, tagline } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  const project = await Project.findOne({ _id: projectId, user: req.user.id });

  if (!project) {
    return res.status(404).json({ message: 'Project not found or not authorized' });
  }

  try {
    if (projectName) project.projectName = projectName;
    if (logoUrl) project.logoUrl = logoUrl;
    if (tagline) project.tagline = tagline;

    const updatedProject = await project.save();

    res.status(200).json({ 
      message: 'Project updated successfully', 
      project: updatedProject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Project name already exists' });
    }
    res.status(500).json({ message: 'An error occurred while updating the project' });
  }
});


module.exports = {
  createProject,
  getProjects,
  updateProject
};