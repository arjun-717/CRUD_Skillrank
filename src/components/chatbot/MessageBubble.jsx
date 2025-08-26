
export default function MessageBubble ({ message, isLoading = false }) {
  const getActionIcon = (action) => {
    const iconMap = {
      create: 'user-plus',
      search: 'search',
      update: 'edit',
      delete: 'trash',
      cancel: 'times',
      help: 'question-circle',
      error: 'exclamation-triangle'
    };
    return iconMap[action] || 'robot';
  };

  if (isLoading) {
    return (
    <div className="flex items-start space-x-3 animate-fade-in">
  {/* Spinner Circle */}
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
    <i className="fas fa-spinner text-white text-base sm:text-lg animate-spin"></i>
  </div>

  {/* Chat Bubble */}
  <div className="bg-white border border-gray-200 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-md max-w-[70vw] sm:max-w-xs">
    <div className="flex items-center space-x-2">
      {/* Bouncing Dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-xs sm:text-sm text-gray-600">Thinking deeply... 🤔</span>
    </div>
  </div>
</div>

    );
  }

  return (
<div className="animate-fade-in">
  <div
    className={`flex items-start space-x-3 ${
      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
    }`}
  >

{/* Avatar Circle */}
<div
  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white ${
    message.type === 'user'
      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }`}
>
  <i
    className={`fas fa-${message.type === 'user' ? 'user' : getActionIcon(message.action)} text-white text-lg sm:text-xl`}
  ></i>
</div>

{/* Message Bubble */}
<div
  className={`max-w-[70vw] sm:max-w-2xl px-3 py-2 sm:px-4 sm:py-3 rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-[1.005] hover:shadow-2xl ${
    message.type === 'user'
      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
      : 'bg-gradient-to-br from-white to-gray-100 text-gray-800'
  }`}
>


      <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
        {message.content}
      </div>

      {/* Timestamp + Action */}
      <div
        className={`text-[10px] sm:text-xs mt-1 sm:mt-2 opacity-80 flex items-center justify-between ${
          message.type === 'user' ? 'text-grey' : 'text-black-100'
        }`}
      >
        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {message.action && message.type === 'bot' && (
          <span className="ml-2 px-2 py-1 bg-white/20 backdrop-blur-sm text-black-100 rounded-full text-xs flex items-center hover:bg-black/10 transition-colors">
            <i className={`fas fa-${getActionIcon(message.action)} w-3 h-3 mr-1 text-black-100`}></i>
            {message.action}
          </span>
        )}
      </div>
    </div>
  </div>
</div>


  );
};