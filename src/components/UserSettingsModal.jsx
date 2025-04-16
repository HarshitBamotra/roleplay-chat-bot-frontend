import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function UserSettingsModal({ user, onClose }) {
  const {setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username || '',
    profileImage: null
  });
  const [imagePreview, setImagePreview] = useState(user.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      });
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      if (formData.profileImage) {
        formDataToSend.append('image', formData.profileImage);
      }

      const response = await api.put('/api/v1/auth/me', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = response.data.data;
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>User Settings</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="user-settings-form">
          {error && <div className="error-message form-error">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group image-upload">
            <label htmlFor="profile-image">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <Upload />
                  <span>Upload Profile Picture</span>
                </div>
              )}
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Your username"
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserSettingsModal;