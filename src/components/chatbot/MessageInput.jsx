
// import { useRef } from "react";



// export default function MessageInput({ 
//   inputMessage, 
//   setInputMessage, 
//   onSubmit, 
//   isLoading, 
//   conversationState 
// }){
//   const inputRef = useRef(null);

//   const getPlaceholder = () => {
//     if (conversationState.mode === 'idle') {
//       return "Hi! Ask me anything... 😊 (e.g., 'create user', 'search users')";
//     }
//     if (conversationState.mode === 'creating') {
//       return "All fields are required - let's build this together! ✨";
//     }
//     if (conversationState.mode === 'searching') {
//       return "Enter name, email, or ID to search... 🔍";
//     }
//     return "Type your response... 💭";
//   };

//   const getHelpText = () => {
//     if (conversationState.mode === 'idle') {
//       return "💡 Try: 'create user', 'search users', 'update user', or 'delete user'";
//     }
//     if (conversationState.mode === 'creating') {
//       return "⚠️ All fields are mandatory - no skipping allowed! 🎯";
//     }
//     if (conversationState.mode === 'searching') {
//       return "🔍 Search by: name, email, User ID (24 chars), or type 'all' • Say 'back' to return";
//     }
//     if (conversationState.mode !== 'idle') {
//       return "💬 Answer the question above, or type 'cancel' to stop";
//     }
//     return "";
//   };

//   const handleSubmit = (e) => {
//     e?.preventDefault?.();
//     onSubmit(inputMessage);
//   };

//   return (
// <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg">
//   <form onSubmit={handleSubmit} className="flex flex-row space-x-3">
//     <div className="flex-1 relative">
//       <input
//         ref={inputRef}
//         type="text"
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//         placeholder={getPlaceholder()}
//         className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
//         disabled={isLoading}
//       />  
//       {!inputMessage && (
//         <div className="absolute right-3 top-3 text-gray-400 hidden md:block">
//           <i className="fas fa-comment-dots text-base sm:text-lg"></i>
//         </div>
//       )}
//     </div>
//     <button
//       type="submit"
//       disabled={isLoading || !inputMessage.trim()}
//       className="px-5 py-3 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
//     >
//       {isLoading ? (
//         <i className="fas fa-spinner animate-spin text-base sm:text-lg"></i>
//       ) : (
//         <i className="fas fa-paper-plane text-base sm:text-lg"></i>
//       )}
//     </button>
//   </form>

//   <div className="mt-3 text-center">
//     <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
//       {getHelpText()}
//     </p>
//   </div>
// </div>


//   );
// };


import { useRef } from "react";

export default function MessageInput({ 
  inputMessage, 
  setInputMessage, 
  onSubmit, 
  isLoading, 
  conversationState,
  placeholder 
}){
  const inputRef = useRef(null);

  const getPlaceholder = () => {
    // Use provided placeholder if available
    if (placeholder) {
      return placeholder;
    }

    // Dynamic placeholder based on conversation state
    if (conversationState.mode === 'idle') {
      return conversationState.useStepByStep 
        ? "Choose an action above or type your request..."
        : "Hi! Ask me anything... (e.g., 'create user named John with email john@email.com')";
    }
    if (conversationState.mode === 'creating') {
      return "All fields are required - let's build this together!";
    }
    if (conversationState.mode === 'searching') {
      return "Enter name, email, or ID to search...";
    }
    if (conversationState.mode === 'updating') {
      return "Please provide the requested information...";
    }
    if (conversationState.mode === 'deleting') {
      return "Please provide the requested information...";
    }
    if (conversationState.mode === 'nlp_confirmation') {
      return "Type 'yes' to confirm or 'no' to cancel...";
    }
    return "Type your response...";
  };

  const getHelpText = () => {
    if (conversationState.mode === 'idle') {
      if (conversationState.useStepByStep) {
        return "Quick Actions: Use buttons above for guided experience, or type naturally for AI processing";
      }
      return "Try: 'create user', 'search users', 'update user', 'delete user', or describe what you need naturally";
    }
    if (conversationState.mode === 'creating') {
      return "All fields are mandatory - no skipping allowed!";
    }
    if (conversationState.mode === 'searching') {
      return "Search by: name, email, User ID (24 chars), or type 'all' • Say 'back' to return";
    }
    if (conversationState.mode === 'updating') {
      return "Answer the question above, or type 'cancel' to stop";
    }
    if (conversationState.mode === 'deleting') {
      return "Answer the question above, or type 'cancel' to stop";
    }
    if (conversationState.mode === 'nlp_confirmation') {
      return "Confirm your action or cancel the operation";
    }
    if (conversationState.mode !== 'idle') {
      return "Answer the question above, or type 'cancel' to stop";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (inputMessage.trim()) {
      onSubmit(inputMessage);
    }
  };

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-row space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
            disabled={isLoading}
          />  
          {!inputMessage && (
            <div className="absolute right-3 top-3 text-gray-400 hidden md:block">
              <i className="fas fa-comment-dots text-base sm:text-lg"></i>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-5 py-3 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {isLoading ? (
            <i className="fas fa-spinner animate-spin text-base sm:text-lg"></i>
          ) : (
            <i className="fas fa-paper-plane text-base sm:text-lg"></i>
          )}
        </button>
      </form>

      <div className="mt-3 text-center">
        <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
          {getHelpText()}
        </p>
      </div>
    </div>
  );
};
