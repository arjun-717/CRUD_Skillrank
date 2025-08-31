import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import AddUser from "./pages/AddUser";
import UserPage from "./pages/UserPage";
import { ToastContainer } from 'react-toastify';
import ChatbotUI from "./pages/ChatBotUI";
import FloatingChatbot from "./components/chatbot/FloatingChatbot";
import SeleniumPage from "./pages/Selenium";


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="mx-auto relative">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/adduser" element={<AddUser/>} />
        <Route path="/users" element={<UserPage/>} />
        <Route path="/chatbot" element={<ChatbotUI/>} />
        <Route path="/selenium" element={<SeleniumPage/>}/>
      </Routes>
      
      <FloatingChatbot navigate={navigate} location={location} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer />
    </BrowserRouter>
  );
}