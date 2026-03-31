import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

function SubmitStory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'mental-health'
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    // Create previews
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name
    }));
    setPreviews(newPreviews);
  };

  const removeFile = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('author', formData.author.trim() || 'Anonymous');
      data.append('category', formData.category);

      mediaFiles.forEach(file => {
        data.append('media', file);
      });

      await axios.post(`${API_URL}/api/stories`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to submit story. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-story">
      <h1 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2rem' }}>
        ✍️ Share Your Story
      </h1>

      <div className="card" style={{ padding: '2rem' }}>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Your story matters. Share your experience to raise awareness and inspire others.
        </p>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Story Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Give your story a title"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            >
              <option value="mental-health">🧠 Mental Health</option>
              <option value="discrimination">✊ Discrimination</option>
              <option value="inequality">⚖️ Inequality</option>
              <option value="social-challenges">🌍 Social Challenges</option>
              <option value="other">📖 Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Name (optional)
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Leave blank to post anonymously"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              📷 Add Images or Videos (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                background: '#f9fafb'
              }}
            />
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Supported: JPG, PNG, GIF, WebP, MP4, WebM (max 50MB each, up to 5 files)
            </p>

            {previews.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {previews.map((preview, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    width: '120px'
                  }}>
                    {preview.type === 'image' ? (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                    ) : (
                      <video
                        src={preview.url}
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db'
                        }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.25rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {preview.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Story *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Share your experience..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {submitting ? 'Submitting...' : 'Submit Your Story'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitStory;

