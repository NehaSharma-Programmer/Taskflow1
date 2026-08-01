
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getTasks, updateTask } from "../services/taskService";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "../styles/kanban.css";

function Kanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.tasks || [];

      setTasks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await updateTask(taskId, {
        status: newStatus,
      });

      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = {
    Todo: tasks.filter((task) => task.status === "Todo"),
    "In Progress": tasks.filter(
      (task) => task.status === "In Progress"
    ),
    Done: tasks.filter((task) => task.status === "Done"),
  };

  return (
    <div className="kanban-page">
      <Sidebar />

      <div className="kanban-content">
        <h1>📋 Kanban Board</h1>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="kanban-board">

            {Object.entries(columns).map(([status, items]) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="column-header">
  <h2>{status}</h2>
  <span>{items.length}</span>
</div>

                    {items.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="kanban-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h3>{task.title}</h3>

                           <p>
 {task.description?.slice(0,80)}
 {task.description?.length > 80 && "..."}
</p>

                           <span 
 className={`priority ${task.priority?.toLowerCase()}`}
>
 🔥 {task.priority}
</span>

                            <p>
                              📅{" "}
                              {task.dueDate
                                ? new Date(
                                    task.dueDate
                                  ).toLocaleDateString()
                                : "No Due Date"}
                            </p>

                            {task.project && (
                              <p>
                                📂 {task.project.title}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}

          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Kanban;
