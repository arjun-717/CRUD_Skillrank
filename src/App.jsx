import { BrowserRouter, Route,Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AddUser from "./pages/AddUser";
import UserPage from "./pages/UserPage";
import { ToastContainer, toast } from 'react-toastify';


export default function App() {

  
  return (
    <div className=" mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/adduser" element={<AddUser/>}/>
          <Route path="/users" element={<UserPage/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />

      
    </div>
  );
}
