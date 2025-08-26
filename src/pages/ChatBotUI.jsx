import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/chatbot/Header';
import QuickActions from '../components/chatbot/QuickActions';
import ProgressIndicator from '../components/chatbot/ProgressIndicator';
import MessagesContainer from '../components/chatbot/MessagesContainer';
import MessageInput from '../components/chatbot/MessageInput';


const ChatbotUI = () => {

  const API_ENDPOINT =import.meta.env.VITE_API_CHATBOT
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
content: "Hello! I'm your Smart CurdMate Assistant, here to help make managing users simple and smooth. 😊\n\nHere’s what I can do:\n\n🆕 Create Users – Add new users easily.\n🔍 Search Users – Find users by name, email, or ID.\n✏️ Update Users – Keep user info up to date.\n🗑️ Delete Users – Remove users safely.\n\nHow would you like to get started today?",
      timestamp: new Date(),
      action: 'help'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState({
    mode: 'idle', // idle, creating, updating, deleting, searching
    step: 0,
    data: {},
    operation: null
  });




  // creation flow
  const createUserFlow = [
    { 
      field: 'name', 
question: "Let's create a new user! 😊\n\nCould you please provide their full name?",
      required: true 
    },
    { 
      field: 'email', 
question: "Great! Could you provide their email address so we can stay connected? 📧",
      required: true 
    },
    { 
      field: 'phone', 
question: "📱 Great! Could you please provide their phone number? I’ll keep it safe and secure! 🔒",
      required: true 
    },
    { 
      field: 'age', 
question: "🎂 Almost done! Could you tell me their age, please? 😊",
      required: true 
    },
    { 
      field: 'address', 
question: "🏠 Final step! Could you share their address, please? 💝",
      required: true 
    }
  ];




  // Update flow
  const updateUserFlow = [
    { 
      field: 'user_id', 
question: "🔄 Let's update a user! ✨ Could you please provide their User ID, the 24-character code that uniquely identifies them? 🆔",
      required: true 
    },
    { 
      field: 'field_selection', 
question: "🎯 Great! Which part of their profile would you like to update? 💫\n\n• **name** - Their identity\n• **email** - Their digital gateway\n• **phone** - Their contact number\n• **age** - Their life milestone\n• **address** - Their home base\n\nPlease choose what we should update: ⭐",
      required: true 
    },
    { 
      field: 'new_value', 
question: "✍️ Excellent choice! What’s the new value for this field? Let’s make it perfect! 🌈",
      required: true 
    }
  ];


  const sendMessage = async (message) => {


    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputMessage('');

    try {
      const response = await processMessage(message.toLowerCase().trim());
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message,
        timestamp: new Date(),
        action: response.action
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.newState) {
        setConversationState(response.newState);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
content: `😔 Oops! Something went wrong:\n\n❌ ${error.message}\n\n🔄 No worries! Try again, and we’ll make it right! ✨`,
        timestamp: new Date(),
        action: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processMessage = (message) => {
    const state = conversationState;
    switch (state.mode) {
      case 'idle':
        return handleIdleMode(message);
      case 'creating':
        return handleCreateMode(message);
      case 'updating':
        return handleUpdateMode(message);
      case 'deleting':
        return handleDeleteMode(message);
      case 'searching':
        return handleSearchMode(message);
      default:
        return handleIdleMode(message);
    }
  };


  const handleIdleMode = (message) => {


    if (message.includes('create') || message.includes('add') || message.includes('new user') || message.includes('register')) {
      return {
        message: createUserFlow[0].question,
        action: 'create',
        newState: { mode: 'creating', step: 0, data: {}, operation: 'create' }
      };
    }


    if (message.includes('search') || message.includes('find') || message.includes('show') || message.includes('list') || message.includes('view')) {
      return {
message: "🔍 Let's find some users! 🕵️‍♂️\n\n🌟 You can search by:\n\n• Type **'all'** to see everyone 👥\n• Enter a **name** to find someone by name 👤\n• Enter an **email** to search via email 📧\n• Enter a **User ID** (24 characters) to find someone specific 🎯\n• Type **'back'** to return to the main menu 🏠\n\nWhich users shall we discover today? ✨",
        action: 'search',
        newState: { mode: 'searching', step: 0, data: {}, operation: 'search' }
      };
    }


    if (message.includes('update') || message.includes('edit') || message.includes('modify') || message.includes('change')) {
      return {
        message: updateUserFlow[0].question,
        action: 'update',
        newState: { mode: 'updating', step: 0, data: {}, operation: 'update' }
      };
    }



    if (message.includes('delete') || message.includes('remove')) {
      return {
message: "⚠️ Delete mode activated! This is important. 😟\n\n🆔 Please provide the 24-character User ID of the person you want to remove. This action is permanent.\n\n🔒 Once you share the ID, I’ll guide you safely through the deletion process.",
        action: 'delete',
        newState: { mode: 'deleting', step: 0, data: {}, operation: 'delete' }
      };
    }


    // Default response for unrecognized input
    return {
message: "🤔 I'm not sure what you'd like to do, and that's totally okay! Let me guide you. 😊\n\n🎯 **Here’s what I can help with:**\n\n🆕 **Create User** - Try 'create user', 'add user', or 'new user'\n🔍 **Search Users** - Try 'search users', 'find users', or 'show users'\n✏️ **Update User** - Say 'update user', 'edit user', or 'modify user'\n🗑️ **Delete User** - Use 'delete user' or 'remove user' (be careful!)\n\n💫 I’m here to make user management smooth and enjoyable! Which would you like to try? 🌟",
      action: 'help',
      newState: null
    };
  };




  const handleCreateMode = async (message) => {
    const currentStep = conversationState.step;
    const currentField = createUserFlow[currentStep];
    const newData = { ...conversationState.data };

    // back
    if (message === 'back' || message === 'cancel') {
      return {
message: "😔 User creation cancelled. No worries – I’ll be here whenever you’re ready to create a new user! 🌈\n\nWhat else can I help you with today? 😊",
        action: 'cancel',
        newState: { mode: 'idle', step: 0, data: {}, operation: null }
      };
    }

    // if enter skip
    if (!message || message.trim() === '' || message === 'skip') {
      return {
message: `😅 Oops! This field is required – I can't leave it blank! 🚫\n\n💡 I need the ${currentField.field} to complete this user. It's an important part of the process! 📝\n\n${currentField.question}`,
        action: 'create',
        newState: null
      };
    }

    // Validate email 
    if (currentField.field === 'email' && !isValidEmail(message)) {
      return {
message: "📧 That doesn't seem like a valid email address. 🤔\n\nPlease enter something like 'example@email.com' with the '@' and a domain. ✨\n\nYou got this! 💪",
        action: 'create',
        newState: null
      };
    }

    // Validate age
    if (currentField.field === 'age') {
      const age = parseInt(message);
      if (isNaN(age) || age < 1 || age > 120) {
        return {
message: "🎂 Hmm, that age doesn't look quite right! 😅\n\nPlease enter a number between 1 and 120. What's their actual age? 🤗",
          action: 'create',
          newState: null
        };
      }
      newData[currentField.field] = age;
    } else {
      newData[currentField.field] = message;
    }




    // Move to next step
    const nextStep = currentStep + 1;
    if (nextStep >= createUserFlow.length) {
      return await completeUserCreation(newData);
    }

    return {
      message: createUserFlow[nextStep].question,
      action: 'create',
      newState: { ...conversationState, step: nextStep, data: newData }
    };
  };





  const completeUserCreation = async (userData) => {
    try {

      console.log('Creating user with data:', userData);
      
      const messageStr = `Create user with name: ${userData.name}, email: ${userData.email}, phone: ${userData.phone}, age: ${userData.age}, address: ${userData.address}`;
      
      
      console.log('Sending API request with message:', messageStr);

      // api
      const requestBody = {
        message: messageStr
      };
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response:', result);
      return {
message: `🎉 **User Created Successfully!** 🎉

✨ ${result.message || 'Welcome to our digital family, ' + userData.name + '!'} ✨

🌟 **User Details:**
👤 **Name:** ${userData.name}
📧 **Email:** ${userData.email}
📱 **Phone:** ${userData.phone}
🎂 **Age:** ${userData.age}
🏠 **Address:** ${userData.address}

💫 This user is now part of our community! What would you like to do next? 🚀`,
        action: 'create',
        newState: { mode: 'idle', step: 0, data: {}, operation: null }
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
message: `😟 Oops! Something went wrong in the digital realm! 🌩️

❌ **Error:** ${error.message}

🔄 No worries – these things happen! Please check your internet connection and try again. We've got this! 💪✨`,
        action: 'create',
        newState: { mode: 'idle', step: 0, data: {}, operation: null }
      };
    }
  };






  const handleUpdateMode = async (message) => {
    const currentStep = conversationState.step;
    const newData = { ...conversationState.data };

    if (message === 'back' || message === 'cancel') {
      return {
message: "😊 No worries! User update has been cancelled. Changing your mind is perfectly fine! 🌈\n\nWhat would you like to do next? I'm here to help! ✨",
        action: 'cancel',
        newState: { mode: 'idle', step: 0, data: {}, operation: null }
      };
    }

    if (currentStep === 0) {
      if (!isValidUserId(message)) {
        return {
message: "🔍 Hmm, that doesn’t seem like a valid User ID! 🤔\n\n💡 I need a 24-character code made of letters and numbers (e.g., 507f1f77bcf86cd799439011).\n\n🎯 Tip: User IDs are unique, like digital fingerprints! ✨\n\nPlease double-check and try again. You’ve got this! 💪",
          action: 'update',
          newState: null
        };
      }
      newData.user_id = message;
      return {
        message: updateUserFlow[1].question,
        action: 'update',
        newState: { ...conversationState, step: 1, data: newData }
      };
    }

    if (currentStep === 1) {
      const validFields = ['name', 'email', 'phone', 'age', 'address'];
      if (!validFields.includes(message)) {
        return {
message: "🎯 Oops! Please choose from the available options. 😅\n\n✨ **Your choices are:**\n• **name** 👤\n• **email** 📧\n• **phone** 📱\n• **age** 🎂\n• **address** 🏠\n\nWhich one would you like to update? 🌟",
          action: 'update',
          newState: null
        };
      }
      newData.field = message;
      return {
message: `✍️ Great choice! What's the new **${message}** value? ✨\n\nLet's make it just right! 🌟`,
        action: 'update',
        newState: { ...conversationState, step: 2, data: newData }
      };
    }

    if (currentStep === 2) {

      // Validate new value 
      if (newData.field === 'email' && !isValidEmail(message)) {
        return {
message: "📧 That email doesn't look quite right! 😊\n\n💡 Please enter something like 'name@domain.com' with the @ symbol. ✨\n\nGive it another try! You got this! 💪",
          action: 'update',
          newState: null
        };
      }


      if (newData.field === 'age') {
        const age = parseInt(message);
        if (isNaN(age) || age < 1 || age > 120) {
          return {
message: "🎂 Hmm, that age doesn't seem quite right! 😅\n\nPlease enter a number between 1 and 120. 👶👵\n\nWhat's their correct age? 🤗",
            action: 'update',
            newState: null
          };
        }
        newData.new_value = age;
      } else {
        newData.new_value = message;
      } 




      //  API to update user
      try {
        console.log('Updating user with data:', newData);
        
        const messageStr = `Update user id: ${newData.user_id} with ${newData.field}: ${newData.new_value}`;
        console.log('Sending update request:', messageStr);

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: messageStr
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Update API Response:', result);
        
        return {
message: `🎉 **UPDATE SUCCESSFUL!** 🎉

✨ ${result.message || `Great! I've updated the ${newData.field} for user ${newData.user_id}.`} ✨

🔄 **Details:**
🆔 **User ID:** ${newData.user_id}
📝 **Field:** ${newData.field}
✨ **New Value:** ${newData.new_value}

🌟 All done! What shall we do next? 🚀`,
          action: 'update',
          newState: { mode: 'idle', step: 0, data: {}, operation: null }
        };
      } catch (error) {
        console.error('Update API Error:', error);
        return {
message: `😔 Oops! Something went wrong during the update. 🌩️

❌ **Error:** ${error.message}

🔄 No worries! Sometimes things hiccup in the digital world. Please check your connection and let's try again. I'm here to help! 💪✨`,
          action: 'update',
          newState: { mode: 'idle', step: 0, data: {}, operation: null }
        };
      }
    }
  };




  const handleDeleteMode = async (message) => {
    if (message === 'back' || message === 'cancel') {
      return {
message: "😌 Phew! Deletion cancelled. It's always good to double-check! 💭\n\nThe user remains safe and sound. What else would you like to do today? 🌈✨",
        action: 'cancel',
        newState: { mode: 'idle', step: 0, data: {}, operation: null }
      };
    }

    if (conversationState.step === 0) {
      if (!isValidUserId(message)) {
        return {
message: "🔍 Hmm, that doesn't seem like a valid User ID for deletion! 🤔\n\n💡 **I need:** A 24-character code (letters and numbers)\n**Example:** 507f1f77bcf86cd799439011\n\n⚠️ Since this is for deletion, accuracy is important. Could you please double-check the ID? 💪",
          action: 'delete',
          newState: null
        };
      }

      return {
message: `⚠️ **Delete Confirmation** ⚠️

You are about to delete the user: **${message}**.

❗ This action is permanent and cannot be undone.

Please confirm:

✅ Type **'YES'** to proceed with deletion  
❌ Type **'NO'** to cancel and keep the user safe

Take a moment to be sure before proceeding. 💭`,
        action: 'delete',
        newState: { ...conversationState, step: 1, data: { user_id: message } }
      };
    }

    if (conversationState.step === 1) {
      if (message === 'yes') {
        try {
          console.log('Deleting user with ID:', conversationState.data.user_id);
          
          const messageStr = `Delete user id: ${conversationState.data.user_id}`;
          console.log('Sending delete request:', messageStr);

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              message: messageStr,
              confirm: true
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Delete API Response:', result);
          
          return {
message: `✅ **User Deleted Successfully** ✅

${result.message || `The user with ID ${conversationState.data.user_id} has been removed.`}

🆔 **Deleted User ID:** ${conversationState.data.user_id}

The operation is complete. 🌟

What would you like to do next? I'm here to help with anything you need! ✨`,
            action: 'delete',
            newState: { mode: 'idle', step: 0, data: {}, operation: null }
          };
        } catch (error) {
          console.error('Delete API Error:', error);
          return {
message: `⚠️ Oops! Something went wrong while trying to delete the user. 🌩️

❌ **Error:** ${error.message}

No worries! Please check your connection and try again when ready. I'm here to help! 💫`,
            action: 'delete',
            newState: { mode: 'idle', step: 0, data: {}, operation: null }
          };
        }
      } else if (message === 'no') {
        return {
message: `🎉 **Great Choice!** 🎉

😊 You decided to spare the user! Sometimes a little mercy goes a long way. The user is safe for now! 🌟

💝 Well done for thinking twice! Deletion is permanent, but kindness lasts. ✨

What would you like to do next? Let's create something positive together! 🚀`,
          action: 'cancel',
          newState: { mode: 'idle', step: 0, data: {}, operation: null }
        };
      } else {
        return {
message: `🤔 I didn’t quite understand! This is an important decision, so let’s be sure. 💭

✅ Type **'YES'** to confirm deletion  
❌ Type **'NO'** to keep the user safe 😊

What would you like to do? 🌟`,
          action: 'delete',
          newState: null
        };
      }
    }
  };





















 const handleSearchMode = async (message) => {
  if (message === 'back' || message === 'cancel') {
    return {
message: "🔍 Search cancelled! No problem at all – it’s okay to change your mind. 😊\n\nWhat else would you like to explore today? 🌟✨",
      action: 'cancel',
      newState: { mode: 'idle', step: 0, data: {}, operation: null }
    };
  }

  try {
    let apiUrl;
    let searchType = '';
    let method = 'GET';
    let preMessage = "";

    const BASE_URL = import.meta.env.VITE_API_GET_SINGLE_USER

    
    if (message === "all") {
      apiUrl = `${BASE_URL}?page=1&limit=10`;
      searchType = 'showing everyone';
preMessage = `✨📊 **Here are the first 10 results** ✨\n👉 Want to see more? Visit our website for the full list! 🌐\n\n`;
    }
    // by id
    else if (isValidUserId(message)) {
      apiUrl = `${BASE_URL}/${message}`;
      searchType = `finding user with ID: ${message}`;
    }
    // by email
    else if (isValidEmail(message)) {
      apiUrl = API_ENDPOINT;
      method = 'POST';
      searchType = `searching for email: ${message}`;
    }
    // by name or fallback
    else {
      apiUrl = API_ENDPOINT;
      method = 'POST';
      searchType = `looking for name: ${message}`;
    }

    console.log('Sending search request to:', apiUrl);

    let response;
    if (method === 'POST') {
      const messageStr = isValidEmail(message)
        ? `Search for users with email ${message}`
        : `Search for users with name ${message}`;

      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: messageStr })
      });
    } else {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
    }

    if (!response.ok) {
      if (response.status === 404) {
        return {
message: `😔 **No Results Found!**\n\n🔍 I looked everywhere but couldn't find what you're searching for! 🕵️‍♂️\n\n💡 **Check these:**\n• Make sure the User ID is correct (if searching by ID)\n• Verify the name or email accuracy\n• Perhaps the user hasn’t been created yet?\n\n🌟 Want to try a different search or create a new user instead? I'm here to help! ✨`,
          action: 'search',
          newState: { mode: 'idle', step: 0, data: {}, operation: null }
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Search API Response:', result);

    let displayMessage = '';

    if (result.data && Array.isArray(result.data)) {
      if (result.data.length === 0) {
displayMessage = `😔 No users found, but don't worry! Try a different search term and let's see what we discover! 🔍✨`;
      } else {
        displayMessage = `🎉 **Found ${result.data.length} user${result.data.length > 1 ? 's' : ''}!** 🌟\n\n`;

        result.data.forEach((user, index) => {
          displayMessage += `——— 👤 User ${index + 1} ———\n`;
          displayMessage += `🆔 ${user._id}\n`;
          displayMessage += `📝 ${user.name || "N/A"}\n`;
          displayMessage += `📧 ${user.email || "N/A"}\n`;
          displayMessage += `📱 ${user.phone || "N/A"}\n`;
          displayMessage += `🎂 ${user.age || "N/A"}\n`;
          displayMessage += `🏠 ${user.address || "N/A"}\n\n`;
        });

        // Pagination info
        if (result.page && result.total_pages) {
          displayMessage += `📄 Page ${result.page}/${result.total_pages} • Total: ${result.total_records}\n`;
        }
      }
    }
    // single user
    else if (result._id) {
      displayMessage = `🎯 **Perfect Match Found!** 🎯\n\n`;
      displayMessage += `——— 👤 User ———\n`;
      displayMessage += `🆔 ${result._id}\n`;
      displayMessage += `📝 ${result.name || "N/A"}\n`;
      displayMessage += `📧 ${result.email || "N/A"}\n`;
      displayMessage += `📱 ${result.phone || "N/A"}\n`;
      displayMessage += `🎂 ${result.age || "N/A"}\n`;
      displayMessage += `🏠 ${result.address || "N/A"}\n\n✨ This user looks amazing! 🌟\n`;
    }
    else if (result.message) {
      displayMessage = result.message;
    }
    else {
      displayMessage = '✅ Search completed successfully! 🎉';
    }

    
    return {
      message: `${preMessage}🔍 **Search Complete!** 🔍\n\n🎯 I was ${searchType} and here's what I discovered:\n\n${displayMessage}\n\n🌟 **What's next?**\n• Type 'search users' to start a new search adventure! 🔍\n• Try any of our other amazing features! 🚀\n• Just ask me anything - I'm here to help! 💫\n\nWhat sounds exciting to you? 😊`,
      action: 'search',
      newState: { mode: 'idle', step: 0, data: {}, operation: null }
    };
  } catch (error) {
    console.error('Search API Error:', error);
    return {
      message: `⚠️🚨 **Search Error Alert!** 🚨⚠️\n\n🌩️ Oops... my search radar hit some turbulence!\n\n❌ **Error Details:** ${error.message}\n\n🔄 But don't worry — sometimes the digital winds are unpredictable. \n\n💡 **Tip:**\n• Double-check your internet connection\n• Try again in a moment\n• Or refine your search term ✨\n\n💪 I'm still here and ready to help you find what you're looking for! 🚀`,
      action: 'search',
      newState: { mode: 'idle', step: 0, data: {}, operation: null }
    };
  }
};








  // Helper functions
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUserId = (id) => {
    // Fixed: More flexible ID validation
    return /^[a-fA-F0-9]{24}$/.test(id) || /^[a-fA-F0-9]{12}$/.test(id);
  };

  const handleSubmit = (message) => {
    sendMessage(message);
  };

  const handleActionClick = (action) => {
    sendMessage(action);
  };

  const handleCancel = () => {
    sendMessage('cancel');
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <Header conversationState={conversationState} />

   
      <QuickActions 
        conversationState={conversationState} 
        isLoading={isLoading} 
        onActionClick={handleActionClick} 
      />

  
      <ProgressIndicator 
        conversationState={conversationState} 
        onCancel={handleCancel} 
      />


      <MessagesContainer 
        messages={messages} 
        isLoading={isLoading} 
      />

     
      <MessageInput 
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        conversationState={conversationState}
      />
    </div>
  );
};

export default ChatbotUI;