import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import { AuthStore } from "./Store/AuthStore"
import { useEffect } from "react"
import Dashboard from "./Pages/Dashboard"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Navbar from "./Components/Navbar"
import Sidebar from "./Components/Sidebar"
import Projects from "./Pages/Projects"
import Settings from "./Pages/Settings"
import ProjectID from "./Pages/ProjectID"
import { ProjectStore } from "./Store/ProjectStore"
import IntegrationGuide from "./Pages/SDKpage"
import SettingsPage from "./Pages/Settings"

function App() {

  const {user, fetchUser, } = AuthStore()
  const {fetchProjects } = ProjectStore();


  useEffect(() => {
    
    fetchUser()
    fetchProjects()

  }, [fetchUser,fetchProjects])
  

  return (
    <div className="w-full h-screen relative overflow-hidden  overscroll-none ">
    {!user && <Navbar/>}
    {user && <Sidebar/>}
    <Routes>
      <Route path="/" element={user ? <Dashboard/> : <Navigate to='/login'/> }/>
      <Route path="/login" element={!user ? <Login/> : <Navigate to='/'/>}/>
      <Route path="/register" element={!user ? <Register/> : <Navigate to='/'/>}/>
      <Route path="/sdk" element={user ? <IntegrationGuide/> : <Navigate to='/login'/> }/>
      <Route path="/projects" element={user ? <Projects/> : <Navigate to='/login'/> }/>
      <Route path="/projects/:id" element={user ? <ProjectID/> : <Navigate to='/login'/> }/>
      <Route path="/settings" element={user ? <SettingsPage/> : <Navigate to='/login'/> }/>

    </Routes>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
    </div>
  )
}

export default App
