import React, { useState, useEffect } from 'react';

export default function FloatingChatbot({ navigate, location }) {
  const [currentAction, setCurrentAction] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);

  const actions = [
    { text: "How can I help you?", animation: "animate-pulse" },
    { text: "Need assistance?", animation: "animate-bounce" },
    { text: "Ask me anything!", animation: "animate-wiggle" },
    { text: "I'm here to help!", animation: "animate-slide" },
    { text: "Chat with me!", animation: "animate-fade" },
    { text: "Got questions?", animation: "animate-scale" }
  ];

useEffect(() => {
  const checkShouldHide = () => {
    const routerPath = location?.pathname;
    const windowPath = window.location.pathname;
    
    // Hide if either path indicates we're on chatbot page
    const hideButton = routerPath === "/chatbot" || windowPath === "/chatbot";
    setShouldHide(hideButton);
  };

  checkShouldHide();

  window.addEventListener('popstate', checkShouldHide);
  
  return () => {
    window.removeEventListener('popstate', checkShouldHide);
  };
}, [location?.pathname]); // Add location?.pathname as dependency

  // Cycle through different actions every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAction(prev => (prev + 1) % actions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (navigate) {
      navigate("/chatbot");
    } else {
      // Fallback for when navigate is not available
      window.location.href = "/chatbot";
    }
  };

  // Don't render if we should hide the button
  if (shouldHide) {
    return null;
  }

  return (
    <>
      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        
        .animate-slide {
          animation: slide 2s ease-in-out infinite;
        }
        
        .animate-fade {
          animation: fade 2s ease-in-out infinite;
        }
        
        .animate-scale {
          animation: scale 2s ease-in-out infinite;
        }
        
        .text-transition {
          transition: all 0.5s ease-in-out;
        }
      `}</style>

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleClick}
          className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        >
          <i className="fas fa-robot text-lg group-hover:animate-spin"></i>
          <span className={`hidden sm:block font-medium text-transition ${actions[currentAction].animation}`}>
            {actions[currentAction].text}
          </span>
        </button>
      </div>
    </>
  );
}