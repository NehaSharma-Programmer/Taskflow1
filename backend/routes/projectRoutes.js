const express=require("express");

const router=express.Router();

const protect=require("../middleware/authMiddleware");

const {

createProject,
getProjects,
updateProject,
deleteProject

} = require("../controllers/projectController");

router.delete("/:id", protect, deleteProject);

router.put("/:id", protect, updateProject);

router.post("/",protect,createProject);

router.get("/",protect,getProjects);

module.exports=router;