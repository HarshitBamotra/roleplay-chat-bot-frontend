import { useState } from 'react';
import { X, Upload } from 'lucide-react';

function CreateCharacterModal({ onClose, onSubmit }) {
  const [characterData, setCharacterData] = useState({
    name: '',
    personality: '',
    backstory: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacterData({
      ...characterData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCharacterData({
        ...characterData,
        image: file
      });
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(characterData);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Character</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="character-form">
          <div className="form-group image-upload">
            <label htmlFor="character-image">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Character preview" 
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <Upload />
                  <span>Upload Image</span>
                </div>
              )}
            </label>
            <input
              id="character-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={characterData.name}
              onChange={handleChange}
              required
              placeholder="Enter character name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="personality">Personality</label>
            <textarea
              id="personality"
              name="personality"
              value={characterData.personality}
              onChange={handleChange}
              required
              placeholder="Describe the character's personality..."
              className="form-textarea"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="backstory">Backstory</label>
            <textarea
              id="backstory"
              name="backstory"
              value={characterData.backstory}
              onChange={handleChange}
              required
              placeholder="Write the character's backstory..."
              className="form-textarea"
              rows={5}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={!characterData.name || !characterData.personality || !characterData.backstory}
            >
              Create Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCharacterModal;