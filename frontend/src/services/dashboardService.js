import axios from "axios";

const PROJECT_API = "https://taskflow1-1jps.onrender.com/api/projects";
const TASK_API = "https://taskflow1-1jps.onrender.com/api/tasks";

export const getDashboardData = async () => {

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const projects = await axios.get(PROJECT_API, { headers });

    const tasks = await axios.get(TASK_API, { headers });

    return {

        projects: projects.data,

        tasks: tasks.data

    };

};