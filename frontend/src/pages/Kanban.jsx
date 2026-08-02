import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Columns3, Search, Calendar, FolderKanban, Flame } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { CardSkeleton } from "../components/SkeletonLoader";
import { useToast } from "../context/ToastContext";
import "../styles/kanban.css";
import { getTasks, updateTask } from "../services/taskService";

function Kanban() {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const res = await getTasks();
      const data = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
      setTasks(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load Kanban board", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const previousTask = tasks.find((t) => t._id === taskId);

    if (previousTask && previousTask.status === newStatus) return;

    // Optimistic Update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus });
      showToast(`Task moved to "${newStatus}"`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to move task", "error");
      loadTasks(); // rollback on failure
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = {
    Todo: filteredTasks.filter(
      (task) => task.status === "Todo" || task.status === "Pending"
    ),
    "In Progress": filteredTasks.filter((task) => task.status === "In Progress"),
    Done: filteredTasks.filter(
      (task) => task.status === "Done" || task.status === "Completed"
    ),
  };

  return (
    <div className="kanban-layout">
      <Sidebar />

      <main className="kanban-main">
        <header className="kanban-header-bar">
          <div>
            <h1>📋 Interactive Kanban</h1>
            <p className="subtitle">Drag & drop cards to update task workflow</p>
          </div>

          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Filter board..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {isLoading ? (
          <CardSkeleton count={3} />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
              {Object.entries(columns).map(([columnId, items]) => (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      className={`kanban-column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="column-header">
                        <span className={`column-dot ${columnId.toLowerCase().replace(/\s+/g, "")}`}></span>
                        <h3>{columnId}</h3>
                        <span className="column-count">{items.length}</span>
                      </div>

                      <div className="column-cards-list">
                        {items.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="kanban-card-top">
                                  <span className={`priority-tag ${task.priority?.toLowerCase()}`}>
                                    <Flame size={12} /> {task.priority || "Medium"}
                                  </span>
                                  {task.dueDate && (
                                    <span className="due-tag">
                                      <Calendar size={12} />{" "}
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                <h4>{task.title}</h4>

                                {task.description && (
                                  <p className="kanban-desc">
                                    {task.description.length > 70
                                      ? task.description.slice(0, 70) + "..."
                                      : task.description}
                                  </p>
                                )}

                                {task.project && (
                                  <div className="kanban-project-tag">
                                    <FolderKanban size={12} /> {task.project.title}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}

export default Kanban;
