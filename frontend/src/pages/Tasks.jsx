
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/tasks.css";

import { getProjects } from "../services/projectService";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";


function Tasks() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");


  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");

  const [dueDate, setDueDate] = useState("");

  const [selectedProject, setSelectedProject] = useState("");

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");




  // Load Tasks

  const loadTasks = async()=>{

    try{


      if(user?.role === "admin"){


        const res = await axios.get(

          "https://taskflowbackend-qhqg.onrender.com/api/admin/tasks",

          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }

        );


        setTasks(res.data);


      }
      else{


        const res = await getTasks();


        if(res.data.tasks){

          setTasks(res.data.tasks);

        }
        else{

          setTasks(res.data);

        }


      }


    }
    catch(error){

      console.log(error);

    }

  };





  // Load Projects

  const loadProjects = async()=>{

    try{


      const res = await getProjects();


      if(res.data.projects){

        setProjects(res.data.projects);


        if(res.data.projects.length>0){

          setSelectedProject(res.data.projects[0]._id);

        }

      }
      else{


        setProjects(res.data);


        if(res.data.length>0){

          setSelectedProject(res.data[0]._id);

        }

      }


    }
    catch(error){

      console.log(error);

    }

  };





  useEffect(()=>{

    loadTasks();

    if(user?.role !== "admin"){

      loadProjects();

    }


  },[]);





  const clearForm=()=>{

    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");
    setEditId(null);

  };





  const addTask = async()=>{


    if(
      !title ||
      !description ||
      !selectedProject ||
      !dueDate
    ){

      alert("Please fill all fields");

      return;

    }



    try{


      const taskData={

        title,
        description,
        status,
        priority,
        dueDate,
        project:selectedProject

      };



      if(editId){


        await updateTask(editId,taskData);

        alert("Task Updated Successfully ✅");


      }
      else{


        await createTask(taskData);

        alert("Task Added Successfully ✅");


      }



      clearForm();

      loadTasks();



    }
    catch(error){

      console.log(error);

      alert("Something went wrong");

    }


  };






  const editTask=(task)=>{


    setTitle(task.title);

    setDescription(task.description);

    setStatus(task.status);

    setPriority(task.priority || "Medium");


    setDueDate(

      task.dueDate
      ?
      task.dueDate.substring(0,10)
      :
      ""

    );



    if(task.project){

      setSelectedProject(
        task.project._id || task.project
      );

    }


    setEditId(task._id);


    window.scrollTo({

      top:0,

      behavior:"smooth"

    });


  };






  const removeTask=async(id)=>{


    if(!window.confirm("Delete this task?"))

      return;



    try{

      await deleteTask(id);

      loadTasks();


    }
    catch(error){

      console.log(error);

    }


  };






  const changeStatus=async(task)=>{


    let newStatus="Todo";


    if(task.status==="Todo"){

      newStatus="In Progress";

    }
    else if(task.status==="In Progress"){

      newStatus="Done";

    }



    try{


      await updateTask(task._id,{

        status:newStatus

      });


      loadTasks();



    }
    catch(error){

      console.log(error);

    }


  };





  const filteredTasks = tasks.filter((task)=>

    task.title
    .toLowerCase()
    .includes(search.toLowerCase())

  );





return(

<div className="tasks-page">


<Sidebar />


<div className="tasks-content">


<div className="tasks-header">


<h1>
✅ Manage Tasks
</h1>


<input

className="search-box"

placeholder="🔍 Search Task..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


</div>





{
user?.role !== "admin" && (

<div className="task-form">


<input

placeholder="Task Title"

value={title}

onChange={(e)=>setTitle(e.target.value)}

/>



<textarea

placeholder="Task Description"

value={description}

onChange={(e)=>setDescription(e.target.value)}

/>




<select

value={selectedProject}

onChange={(e)=>setSelectedProject(e.target.value)}

>

{
projects.map((project)=>(

<option

key={project._id}

value={project._id}

>

{project.title}

</option>

))
}


</select>




<select

value={status}

onChange={(e)=>setStatus(e.target.value)}

>

<option value="Todo">
Todo
</option>

<option value="In Progress">
In Progress
</option>

<option value="Done">
Done
</option>

</select>




<select

value={priority}

onChange={(e)=>setPriority(e.target.value)}

>

<option value="Low">
Low
</option>

<option value="Medium">
Medium
</option>

<option value="High">
High
</option>

</select>




<input

type="date"

value={dueDate}

onChange={(e)=>setDueDate(e.target.value)}

/>




<button

className="task-btn"

onClick={addTask}

>

{
editId
?
"💾 Update Task"
:
"+ Add Task"
}

</button>


</div>

)

}






<div className="task-grid">


{
filteredTasks.length===0
?

<h3>No Tasks Found</h3>


:


filteredTasks.map((task)=>(


<div

className="task-card"

key={task._id}

>


<h3>
{task.title}
</h3>



<p>
{task.description}
</p>




<p>

<strong>
Project:
</strong>

{" "}

{task.project?.title || "-"}

</p>




<p>

<strong>
Priority:
</strong>

{" "}

{task.priority}

</p>



<p>

<strong>
Status:
</strong>

{" "}

{task.status}

</p>




{
user?.role !== "admin" && (

<span

className="status"

onClick={()=>changeStatus(task)}

>

{task.status}

</span>

)

}





{
user?.role !== "admin" && (

<div className="task-actions">


<button

className="edit-btn"

onClick={()=>editTask(task)}

>

✏ Edit

</button>



<button

className="delete-btn"

onClick={()=>removeTask(task._id)}

>

🗑 Delete

</button>


</div>

)

}




</div>


))


}


</div>



</div>



</div>

);


}


export default Tasks;
