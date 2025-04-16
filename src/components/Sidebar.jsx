import { LogOut, PlusCircle, User, Settings } from 'lucide-react';

function Sidebar({ user, characters, selectedCharacter, onSelectCharacter, onCreateCharacter, onOpenSettings, onLogout, isLoading }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Characters</h2>
        <button 
          className="create-button" 
          onClick={onCreateCharacter}
          aria-label="Create new character"
        >
          <PlusCircle />
        </button>
      </div>
      
      <div className="characters-list">
        {isLoading ? (
          <div className="loading">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="no-characters">
            <p>No characters yet</p>
            <button onClick={onCreateCharacter}>Create your first character</button>
          </div>
        ) : (
          characters.map((character) => (
            <div 
              key={character._id}
              className={`character-item ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
              onClick={() => onSelectCharacter(character)}
            >
              {character.imageUrl ? (
                <img 
                  src={character.imageUrl} 
                  alt={character.name} 
                  className="character-avatar"
                />
              ) : (
                <div className="character-avatar placeholder">
                  <User size={18} />
                </div>
              )}
              <span>{character.name}</span>
            </div>
          ))
        )}
      </div>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              <User size={18} />
            )}
          </div>
          <span className="username">{user.username}</span>
        </div>
        
        <div className="user-actions">
          <button 
            className="icon-button" 
            onClick={onOpenSettings}
            aria-label="User settings"
          >
            <Settings size={20} />
          </button>
          <button 
            className="icon-button" 
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;