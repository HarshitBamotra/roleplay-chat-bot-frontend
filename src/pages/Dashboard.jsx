import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import CreateCharacterModal from '../components/CreateCharacterModal';
import DeleteCharacterModal from '../components/DeleteCharacterModal';
import UserSettingsModal from '../components/UserSettingsModal';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add these new states for delete functionality
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      fetchChatHistory(selectedCharacter._id);
    } else {
      setMessages([]);
    }
  }, [selectedCharacter]);

  const fetchCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/v1/characters');
      setCharacters(response.data.data);
      if (response.data.data.length > 0 && !selectedCharacter) {
        setSelectedCharacter(response.data.data[0]);
      }
    } catch (err) {
      setError('Failed to load characters. Please try again.');
      console.error('Error fetching characters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async (characterId) => {
    try {
      const response = await api.get(`/api/v1/chat/${characterId}/history`);
      setMessages(response.data.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleCreateCharacter = async (characterData) => {
    try {
      const formData = new FormData();
      formData.append('name', characterData.name);
      formData.append('personality', characterData.personality);
      formData.append('backstory', characterData.backstory);
      if (characterData.image) {
        formData.append('image', characterData.image);
      }
      console.log(formData);
      const response = await api.post('/api/v1/character', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setCharacters([...characters, response.data.data]);
      setSelectedCharacter(response.data.data);
      setIsCharacterModalOpen(false);
    } catch (err) {
      console.error('Error creating character:', err);
    }
  };

  // New function for opening delete modal
  const handleOpenDeleteModal = (character) => {
    setCharacterToDelete(character);
  };

  // New function for handling character deletion
  const handleDeleteCharacter = async (characterId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/api/v1/character/${characterId}`);
      
      // Update characters list
      setCharacters(characters.filter(char => char._id !== characterId));
      
      // If deleted character was selected, select the first available character or null
      if (selectedCharacter && selectedCharacter._id === characterId) {
        const remainingChars = characters.filter(char => char._id !== characterId);
        setSelectedCharacter(remainingChars.length > 0 ? remainingChars[0] : null);
      }
      
      // Close the modal
      setCharacterToDelete(null);
    } catch (err) {
      console.error('Error deleting character:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedCharacter || !content.trim()) return;

    const tempId = Date.now();
    const newUserMessage = {
      content,
      role: 'user',
      timestamp: Date.now()
    };
    
    setMessages([...messages, newUserMessage]);

    try {
      const response = await api.post(`/api/v1/chat/${selectedCharacter._id}`, {
        message: content
      });
      // const updatedMessages = messages.filter(m => m.id !== tempId);
      
      setMessages([...messages, newUserMessage, {role:"model", content:response.data.data.response, timestamp: response.data.data.timestamp}]);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        user={user}
        characters={characters}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={handleCharacterSelect}
        onCreateCharacter={() => setIsCharacterModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onDeleteCharacter={handleOpenDeleteModal}
        onLogout={logout}
        isLoading={isLoading}
      />
      
      <ChatWindow
        character={selectedCharacter}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
      
      {isCharacterModalOpen && (
        <CreateCharacterModal
          onClose={() => setIsCharacterModalOpen(false)}
          onSubmit={handleCreateCharacter}
        />
      )}
      
      {isSettingsModalOpen && (
        <UserSettingsModal
          user={user}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
      
      {characterToDelete && (
        <DeleteCharacterModal
          character={characterToDelete}
          onClose={() => setCharacterToDelete(null)}
          onDelete={handleDeleteCharacter}
          isDeleting={isDeleting}
        />
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Dashboard;
