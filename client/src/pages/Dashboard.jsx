import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("_id");
    const userName = localStorage.getItem("name");

    const api = axios.create({
        baseURL: import.meta.env.VITE_APP_SERVER_API_URL,
        headers: { Authorization: token },
    });

    useEffect(() => {
        const fetchData = async () => {
            const taskRes = await api.get("/tasks/");
            console.log(taskRes);
            setTasks(taskRes.data.data);
        };
        fetchData();
    }, []);

    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
    };

    const updateTask = async () => {
        await api.put(`/tasks/${editingTask._id}`, {
            title: editingTask.title,
            completed: editingTask.completed,
        });

        setTasks(
            tasks.map((t) => (t._id === editingTask._id ? editingTask : t)),
        );
        setEditingTask(null);
    };

    const addTask = async () => {
        const title = newTaskTitle.trim();
        if (!title) {
            alert("enter task title");
            return;
        }

        const res = await api.post("/tasks/", { title });
        if (res.data?.success && res.data?.data) {
            setTasks([res.data.data, ...tasks]);
            setNewTaskTitle("");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const filteredTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Hi, {userName} :)
                </h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    placeholder="Search tasks..."
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New task title..."
                        className="w-full sm:w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={addTask}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Add Task
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {filteredTasks.map((task) => (
                    <div
                        key={task._id}
                        className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
                    >
                        <div>
                            <h3
                                className={`font-semibold ${
                                    task.completed
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                }`}
                            >
                                {task.title}
                            </h3>
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    task.completed
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {task.completed ? "Completed" : "Pending"}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingTask(task)}
                                className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-lg font-bold mb-4">Edit Task</h2>

                        <input
                            value={editingTask.title}
                            onChange={(e) =>
                                setEditingTask({
                                    ...editingTask,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border rounded mb-3"
                        />

                        <label className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                checked={editingTask.completed}
                                onChange={(e) =>
                                    setEditingTask({
                                        ...editingTask,
                                        completed: e.target.checked,
                                    })
                                }
                            />
                            Completed
                        </label>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingTask(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateTask}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
