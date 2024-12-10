import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Navbar from './components/Navbar.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Navbar/>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<App/>}/>
      <Route path='/register' element={<Signup/>}/>

    </Routes>
  </BrowserRouter>,
)
