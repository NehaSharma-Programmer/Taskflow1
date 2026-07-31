const Project=require("../models/Project");

const createProject=async(req,res)=>{

try{

const project=await Project.create({

title:req.body.title,
description:req.body.description,
user:req.user.id

});

res.json(project);

}

catch(err){

res.status(500).json({
message:err.message
});

}

};

const getProjects=async(req,res)=>{

const projects=await Project.find({

user:req.user.id

});

res.json(projects);

};

const updateProject = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found"
      });
    }

    project.title = req.body.title || project.title;

    project.description = req.body.description || project.description;

    const updatedProject = await project.save();

    res.json(updatedProject);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
const deleteProject = async (req, res) => {

    try {

        await Project.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Project Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
module.exports = {

createProject,
getProjects,
updateProject,
deleteProject

};