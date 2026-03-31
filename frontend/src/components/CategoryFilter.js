import React from 'react';

const categories = [
  { slug: 'all', name: 'All Stories', icon: '📚', color: '#6366f1' },
  { slug: 'mental-health', name: 'Mental Health', icon: '🧠', color: '#8b5cf6' },
  { slug: 'discrimination', name: 'Discrimination', icon: '✊', color: '#ef4444' },
  { slug: 'inequality', name: 'Inequality', icon: '⚖️', color: '#f59e0b' },
  { slug: 'social-challenges', name: 'Social Challenges', icon: '🌍', color: '#10b981' },
  { slug: 'other', name: 'Other', icon: '📖', color: '#64748b' }
];

function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="categories">
      {categories.map(cat => (
        <button
          key={cat.slug}
          className={`category-tag ${activeCategory === cat.slug ? 'active' : ''}`}
          style={{ 
            backgroundColor: cat.color,
            color: 'white'
          }}
          onClick={() => onCategoryChange(cat.slug)}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;

