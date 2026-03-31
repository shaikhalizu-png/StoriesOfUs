import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const categoryColors = {
  'mental-health': '#8b5cf6',
  'discrimination': '#ef4444',
  'inequality': '#f59e0b',
  'social-challenges': '#10b981',
  'other': '#6366f1'
};

const categoryNames = {
  'mental-health': 'Mental Health',
  'discrimination': 'Discrimination',
  'inequality': 'Inequality',
  'social-challenges': 'Social Challenges',
  'other': 'Other'
};

function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stories/${id}`);
      setStory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.patch(`${API_URL}/api/stories/${id}/like`);
      setStory(response.data);
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  if (loading) {
    return <p style={{ color: 'white', textAlign: 'center' }}>Loading story...</p>;
  }

  if (!story) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Story not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="story-detail">
      <Link to="/" style={{ color: 'white', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Stories
      </Link>
      
      <article className="card" style={{ padding: '2.5rem' }}>
        <span 
          className="story-category"
          style={{ 
            backgroundColor: categoryColors[story.category],
            marginBottom: '1rem',
            display: 'inline-block'
          }}
        >
          {categoryNames[story.category]}
        </span>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
          {story.title}
        </h1>
        
        <div style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
          By <strong>{story.author}</strong> • {new Date(story.createdAt).toLocaleDateString()}
        </div>

        {/* Media Gallery */}
        {story.media && story.media.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: story.media.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {story.media.map((media, index) => (
                <div key={index} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  {media.type === 'image' ? (
                    <img
                      src={`${API_URL}${media.url}`}
                      alt={`Story media ${index + 1}`}
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'contain',
                        background: '#f3f4f6',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(`${API_URL}${media.url}`, '_blank')}
                    />
                  ) : (
                    <video
                      src={`${API_URL}${media.url}`}
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        background: '#000'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          lineHeight: '1.8',
          fontSize: '1.1rem',
          color: '#374151',
          whiteSpace: 'pre-wrap'
        }}>
          {story.content}
        </div>
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <button 
            onClick={handleLike}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ❤️ {story.likes} Likes
          </button>
        </div>
      </article>
    </div>
  );
}

export default StoryDetail;

