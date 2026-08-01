import axios from "axios";

const API = "https://taskflowbackend-qhqg.onrender.com/api/projects";

const config = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProjects = async () => {
  return await axios.get(API, config());
};

export const createProject = async (project) => {
  return await axios.post(API, project, config());
};

export const updateProject = async (id, project) => {
  return await axios.put(`${API}/${id}`, project, config());
};

export const deleteProject = async (id) => {
  return await axios.delete(`${API}/${id}`, config());
};
