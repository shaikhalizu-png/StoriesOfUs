import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import CategoryFilter from '../components/CategoryFilter';
import API_URL from '../config';

function Home() {
  const [stories, setStories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, [activeCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const params = activeCategory !== 'all' ? { category: activeCategory } : {};
      const [storiesRes, featuredRes] = await Promise.all([
        axios.get(`${API_URL}/api/stories`, { params }),
        axios.get(`${API_URL}/api/stories`, { params: { featured: true } })
      ]);
      setStories(storiesRes.data);
      setFeaturedStories(featuredRes.data.slice(0, 3));
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
    setFeaturedStories(featuredStories.map(s => 
      s._id === storyId ? { ...s, likes: s.likes + 1 } : s
    ));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
          📖 StoriesOfUs
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          A platform for sharing real-life experiences related to social issues. 
          Share your story, raise awareness, and inspire empathy within the community.
        </p>
        <Link to="/submit" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Share Your Story
        </Link>
      </section>

      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {/* Featured Stories */}
      {activeCategory === 'all' && featuredStories.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>
            ⭐ Featured Stories
          </h2>
          <div className="stories-grid">
            {featuredStories.map(story => (
              <StoryCard key={story._id} story={story} onLike={handleLike} />
            ))}
          </div>
        </section>
      )}

      {/* All Stories */}
      <section>
        <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>
          {activeCategory === 'all' ? '📚 Latest Stories' : `Stories in ${activeCategory.replace('-', ' ')}`}
        </h2>
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
            <p>No stories found in this category yet.</p>
            <Link to="/submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Be the first to share!
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

