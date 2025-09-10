import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddContact from "./pages/AddContact";
import ContactsPage from "./pages/ContactsPage";
import { ToastContainer } from 'react-toastify';
import ChatbotUI from "./pages/ChatBotUI";
import FloatingChatbot from "./components/chatbot/FloatingChatbot";
import SeleniumPage from "./pages/Selenium";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // List chatbot routes where FloatingChatbot should be hidden
  const chatbotRoutes = ['/chatbot', '/selenium', '/login', '/register'];
  
  // Check if current route requires hiding FloatingChatbot
  const hideChatbot = chatbotRoutes.some(path => location.pathname.startsWith(path));

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-contact"
          element={
            <ProtectedRoute>
              <AddContact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatbotUI />
            </ProtectedRoute>
          }
        />
        <Route
          path="/selenium"
          element={
            <ProtectedRoute>
              <SeleniumPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Floating Chatbot */}
      {!hideChatbot && (
        <FloatingChatbot navigate={navigate} location={location} />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
