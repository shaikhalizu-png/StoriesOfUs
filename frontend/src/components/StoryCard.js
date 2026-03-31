import React from 'react';
import { Link } from 'react-router-dom';
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

function StoryCard({ story, onLike }) {
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/stories/${story._id}/like`);
      if (onLike) onLike(story._id);
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const firstMedia = story.media && story.media.length > 0 ? story.media[0] : null;

  return (
    <Link to={`/stories/${story._id}`} style={{ textDecoration: 'none' }}>
      <div className="card story-card">
        {firstMedia && (
          <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
            {firstMedia.type === 'image' ? (
              <img
                src={`${API_URL}${firstMedia.url}`}
                alt="Story media"
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <video
                src={`${API_URL}${firstMedia.url}`}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover'
                }}
              />
            )}
            {story.media.length > 1 && (
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                +{story.media.length - 1} more
              </span>
            )}
          </div>
        )}
        <h3>{story.title}</h3>
        <p>{truncateContent(story.content)}</p>
        <div className="story-meta">
          <span
            className="story-category"
            style={{ backgroundColor: categoryColors[story.category] }}
          >
            {categoryNames[story.category]}
          </span>
          <span>By {story.author}</span>
          <span className="likes" onClick={handleLike}>
            ❤️ {story.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default StoryCard;

