import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import CategoryFilter from '../components/CategoryFilter';
import API_URL from '../config';

function Stories() {
  const [stories, setStories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [activeCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const response = await axios.get(`${API_URL}/api/stories`, { params });
      setStories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const handleLike = (storyId) => {
    setStories(stories.map(s => 
      s._id === storyId ? { ...s, likes: s.likes + 1 } : s
    ));
  };

  return (
    <div className="stories-page">
      <h1 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '2rem' }}>
        📚 All Stories
      </h1>

      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {loading ? (
        <p style={{ color: 'white', textAlign: 'center' }}>Loading stories...</p>
      ) : stories.length > 0 ? (
        <div className="stories-grid">
          {stories.map(story => (
            <StoryCard key={story._id} story={story} onLike={handleLike} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No stories found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default Stories;

