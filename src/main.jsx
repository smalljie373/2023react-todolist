import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from "react-router-dom";
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TodolistPage from './pages/TodolistPage.jsx';
import './sass/all.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path='/login' element={ <LoginPage /> } />
      <Route path='/register' element={ <RegisterPage /> } />
      <Route path='/todolist' element={ <TodolistPage /> } />
    </Routes>
  </HashRouter>
)
