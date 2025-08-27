
// export default function QuickActions({ conversationState, isLoading, onActionClick }) {
//   if (conversationState.mode !== 'idle') return null;

//   const actions = [
//     { key: 'create user', icon: 'user-plus', label: 'Create', color: 'from-green-500 to-emerald-500', hoverColor: 'from-green-600 to-emerald-600' },
//     { key: 'search users', icon: 'search', label: 'Search', color: 'from-purple-500 to-violet-500', hoverColor: 'from-purple-600 to-violet-600' },
//     { key: 'update user', icon: 'edit', label: 'Update', color: 'from-blue-500 to-indigo-500', hoverColor: 'from-blue-600 to-indigo-600' },
//     { key: 'delete user', icon: 'trash', label: 'Delete', color: 'from-red-500 to-rose-500', hoverColor: 'from-red-600 to-rose-600' }
//   ];

//   return (
//     <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//       <div className="mb-3 text-center">
//    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">🚀 Quick Actions</h3>
// <p className="text-xs sm:text-sm text-gray-600">Choose what you'd like to do today!</p>

//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//         {actions.map((action) => (
//           <button
//             key={action.key}
//             onClick={() => onActionClick(action.key)}
//             className={`
//               flex flex-row items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm 
//               bg-gradient-to-r ${action.color} text-white rounded-lg sm:rounded-xl 
//               hover:${action.hoverColor} transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
//               disabled:opacity-50 disabled:cursor-not-allowed
//             `}
//             disabled={isLoading}
//           >
//             <i className={`fas fa-${action.icon} text-base sm:text-lg`} />
//             <span className="font-medium">{action.label}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function QuickActions({ conversationState, isLoading, onActionClick }) {
  if (conversationState.mode !== 'idle') return null;

  const actions = [
    { key: 'create user', icon: 'user-plus', label: 'Create', color: 'from-green-500 to-emerald-500', hoverColor: 'from-green-600 to-emerald-600' },
    { key: 'search users', icon: 'search', label: 'Search', color: 'from-purple-500 to-violet-500', hoverColor: 'from-purple-600 to-violet-600' },
    { key: 'update user', icon: 'edit', label: 'Update', color: 'from-blue-500 to-indigo-500', hoverColor: 'from-blue-600 to-indigo-600' },
    { key: 'delete user', icon: 'trash', label: 'Delete', color: 'from-red-500 to-rose-500', hoverColor: 'from-red-600 to-rose-600' }
  ];

  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="mb-3 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">🚀 Quick Actions</h3>
        <p className="text-xs sm:text-sm text-gray-600">Choose what you'd like to do today!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => onActionClick(action.key)}
            className={`
              flex flex-row items-center justify-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm 
              bg-gradient-to-r ${action.color} text-white rounded-lg sm:rounded-xl 
              hover:${action.hoverColor} transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          >
            <i className={`fas fa-${action.icon} text-base sm:text-lg`} />
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}