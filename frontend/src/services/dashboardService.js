import axios from "axios";

const PROJECT_API = "https://taskflowbackend-qhqg.onrender.com/api/projects";
const TASK_API = "https://taskflowbackend-qhqg.onrender.com/api/tasks";

export const getDashboardData = async () => {
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const projectsRes = await axios.get(PROJECT_API, { headers });
    const tasksRes = await axios.get(TASK_API, { headers });

    const rawProjects = projectsRes.data;
    const rawTasks = tasksRes.data;

    const projects = Array.isArray(rawProjects) ? rawProjects : (rawProjects.projects || []);
    const tasks = Array.isArray(rawTasks) ? rawTasks : (rawTasks.tasks || []);

    return {
        projects,
        tasks
    };
};

