import React from 'react'
import Todo from './Todo'
import Login from './Login/Login'
import Register from './Login/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div className='container'>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
