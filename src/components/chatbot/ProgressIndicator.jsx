
export default function ProgressIndicator({ conversationState, onCancel }) {
  if (conversationState.mode === 'idle') return null;

  const getProgressInfo = () => {
    switch (conversationState.mode) {
      case 'creating':
        return {
          title: '🎨 User Creation Journey',
          subtitle: 'All fields are required - let\'s create something amazing together!',
          progress: ((conversationState.step + 1) / 5) * 100
        };
      case 'updating':
        return {
          title: '🔄 User Update Process',
          subtitle: 'Making changes with care and precision',
          progress: ((conversationState.step + 1) / 3) * 100
        };
      case 'deleting':
        return {
          title: '⚠️ User Deletion Process',
          subtitle: 'Handle with extreme caution',
          progress: 50
        };
      case 'searching':
        return {
          title: '🔍 Search Adventure',
          subtitle: 'Finding the perfect match for you',
          progress: 75
        };
      default:
        return { title: '', subtitle: '', progress: 0 };
    }
  };

  const { title, subtitle, progress } = getProgressInfo();

  return (
  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
  <div className="flex items-center justify-between mb-2">
    <div>
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
    <button
      onClick={onCancel}
      className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-xs bg-white px-2 py-1 rounded-full hover:shadow-md transition-all duration-200"
    >
      <i className="fas fa-times w-3 h-3 text-xs"></i>
      <span>Cancel</span>
    </button>
  </div>

  {/* Progress Bar */}
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-600"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
</div>

  );
};
