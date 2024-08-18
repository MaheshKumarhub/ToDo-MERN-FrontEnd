import React, { useEffect, useState } from 'react';
import { signOut, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './Services/firebaseAuth';

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [edit, setEdit] = useState(-1);

    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "https://todo-mern-vmue.onrender.com";
    const navigate = useNavigate();

    // Retrieve Firebase Auth token
    const getToken = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            return token;
        } else {
            navigate('/login');
        }
    };

    const handleSubmit = async () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            try {
                const token = await getToken();
                const res = await fetch(apiUrl + "/todos", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description })
                });
                if (res.ok) {
                    const newTodo = await res.json();
                    setTodos([...todos, newTodo]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to create Todo item");
                }
            } catch {
                setError("Unable to create Todo item");
            }
        }
    };

    const getItems = async () => {
        try {
            const token = await getToken();
            const res = await fetch(apiUrl + "/todos", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (res.status === 401) {
                setError("Unauthorized access. Please log in again.");
                navigate('/login');
            } else if (res.ok) {
                const data = await res.json();
                setTodos(data);
            } else {
                setError("Unable to fetch Todo items");
            }
        } catch {
            setError("Unable to fetch Todo items");
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const handleEdit = (item) => {
        setEdit(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = async () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            try {
                const token = await getToken();
                const res = await fetch(apiUrl + "/todos/" + edit, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: editTitle, description: editDescription })
                });
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === edit) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                    setEdit(-1);
                } else {
                    setError("Unable to update Todo item");
                }
            } catch {
                setError("Unable to update Todo item");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure want to delete?')) {
            try {
                const token = await getToken();
                await fetch(apiUrl + '/todos/' + id, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            } catch {
                setError("Unable to delete Todo item");
            }
        }
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate('/login');
            });
    };

    return (
        <div className='container mt-5'>
            <div className='d-flex justify-content-between align-items-center p-3 bg-primary text-light rounded'>
                <h1>Todo App</h1>
                <button className='btn btn-warning' onClick={handleSignOut}>Sign Out</button>
            </div>

            <div className='mt-4 p-4 bg-light rounded shadow-sm'>
                <h2 className='text-primary'>Add New Task</h2>
                {message && <div className='alert alert-success'>{message}</div>}
                <div className='form-group'>
                    <input 
                        placeholder='Title' 
                        onChange={(e) => setTitle(e.target.value)} 
                        value={title} 
                        className='form-control my-2' 
                        type="text" 
                    />
                    <input 
                        placeholder='Description' 
                        onChange={(e) => setDescription(e.target.value)} 
                        value={description} 
                        className='form-control my-2' 
                        type="text" 
                    />
                    <button className='btn btn-success w-100' onClick={handleSubmit}>Add Task</button>
                    {error && <div className='alert alert-danger mt-2'>{error}</div>}
                </div>
            </div>

            <div className='mt-5'>
                <h3 className='text-primary'>Your Tasks</h3>
                <ul className='list-group'>
                    {todos.map((item) => (
                        <li key={item._id} className='list-group-item d-flex justify-content-between align-items-center my-2 bg-light shadow-sm'>
                            <div className='flex-grow-1 me-3'>
                                {edit === -1 || edit !== item._id ? (
                                    <>
                                        <h5 className='mb-1'>{item.title}</h5>
                                        <p className='mb-1'>{item.description}</p>
                                    </>
                                ) : (
                                    <div className='form-group'>
                                        <input 
                                            placeholder='Title' 
                                            onChange={(e) => setEditTitle(e.target.value)} 
                                            value={editTitle} 
                                            className='form-control mb-2' 
                                            type="text" 
                                        />
                                        <input 
                                            placeholder='Description' 
                                            onChange={(e) => setEditDescription(e.target.value)} 
                                            value={editDescription} 
                                            className='form-control mb-2' 
                                            type="text" 
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='d-flex gap-2'>
                                {edit === -1 || edit !== item._id ? (
                                    <>
                                        <button className='btn btn-info' onClick={() => handleEdit(item)}>Edit</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        <button className='btn btn-success' onClick={handleUpdate}>Update</button>
                                        <button className='btn btn-secondary' onClick={() => setEdit(-1)}>Cancel</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Todo;
