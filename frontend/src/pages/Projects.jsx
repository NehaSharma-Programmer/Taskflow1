
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/projects.css";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";


function Projects() {


  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);



  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");



  const loadProjects = async () => {

    try {


      // Admin ke liye all projects
      if(user?.role === "admin"){


        const res = await axios.get(

          "https://taskflow1-1jps.onrender.com/api/admin/projects",

          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }

        );


        setProjects(res.data);



      }
      else{


        // Normal user projects

        const res = await getProjects();

        setProjects(res.data);


      }



    } catch(error){

      console.log("Project Error:", error);

    }

  };




  useEffect(()=>{

    loadProjects();

  },[]);





  const addProject = async()=>{


    if(!title || !description){

      alert("Please fill all fields");

      return;

    }



    try{


      if(editId){


        await updateProject(editId,{
          title,
          description
        });


        alert("Project Updated Successfully ✅");



      }
      else{


        await createProject({

          title,

          description

        });


        alert("Project Added Successfully ✅");


      }



      setTitle("");

      setDescription("");

      setEditId(null);


      loadProjects();



    }catch(error){

      console.log(error);

      alert("Something went wrong");

    }



  };






  const removeProject = async(id)=>{


    if(window.confirm("Delete this project?")){


      await deleteProject(id);


      loadProjects();


    }


  };






  const editProject = (project)=>{


    setTitle(project.title);

    setDescription(project.description);

    setEditId(project._id);



    window.scrollTo({

      top:0,

      behavior:"smooth"

    });


  };






  return (


    <div className="projects-page">


      <Sidebar />



      <div className="projects-content">



        <div className="projects-header">


          <h1>
            📁 Manage Projects
          </h1>



          <input

            className="search-input"

            type="text"

            placeholder="🔍 Search Project..."

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

          />



        </div>






        {/* Admin ke liye add form nahi dikhana */}

        {
          user?.role !== "admin" && (

          <div className="form-card">


            <input

              type="text"

              placeholder="Enter Project Title"

              value={title}

              onChange={(e)=>setTitle(e.target.value)}

            />



            <textarea

              placeholder="Enter Project Description"

              value={description}

              onChange={(e)=>setDescription(e.target.value)}

            />



            <button

              className="add-btn"

              onClick={addProject}

            >

              {
                editId 
                ? "💾 Update Project"
                : "+ Add Project"
              }


            </button>


          </div>

          )
        }






        <div className="project-grid">



        {
          projects

          .filter((project)=>

            project.title

            .toLowerCase()

            .includes(search.toLowerCase())

          )


          .map((project)=>(


            <div

              className="project-card"

              key={project._id}

            >



              <h3>

                {project.title}

              </h3>



              <p>

                {project.description}

              </p>





              {
                user?.role === "admin" && project.user && (

                  <p>

                    👤 Created By:
                    {" "}
                    {project.user.name}

                  </p>

                )
              }





              {
                user?.role !== "admin" && (

                <div className="project-actions">


                  <button

                    className="edit-btn"

                    onClick={()=>editProject(project)}

                  >

                    ✏️ Edit

                  </button>




                  <button

                    className="delete-btn"

                    onClick={()=>removeProject(project._id)}

                  >

                    🗑 Delete

                  </button>



                </div>

                )
              }





            </div>


          ))

        }






        {
          projects.length === 0 && (

            <h3>
              No Projects Found
            </h3>

          )
        }



        </div>



      </div>



    </div>


  );


}



export default Projects;