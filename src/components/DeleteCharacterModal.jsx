import { useState } from 'react';
import { X } from 'lucide-react';

function DeleteCharacterModal({ character, onClose, onDelete, isDeleting }) {
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await onDelete(character._id);
    } catch (err) {
      setError('Failed to delete character. Please try again.');
    }
  };

  if (!character) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Delete Character</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="character-form">
          <div className="form-group">
            <p>Are you sure you want to delete <strong>{character.name}</strong>?</p>
            <p>This action cannot be undone. All conversations with this character will be permanently deleted.</p>
          </div>

          {error && (
            <div className="form-error">
              <div className="error-message">{error}</div>
            </div>
          )}

          <div className="form-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="submit-button" 
              onClick={handleDelete} 
              disabled={isDeleting}
              style={{ backgroundColor: 'var(--error-color)' }}
            >
              {isDeleting ? 'Deleting...' : 'Delete Character'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteCharacterModal;