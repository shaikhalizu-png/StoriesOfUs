const mongoose = require('mongoose');
require('dotenv').config();

const Story = require('./models/Story');
const Category = require('./models/Category');

const categories = [
  { name: 'Mental Health', slug: 'mental-health', description: 'Stories about mental health awareness and experiences', icon: '🧠', color: '#8b5cf6' },
  { name: 'Discrimination', slug: 'discrimination', description: 'Stories about facing and overcoming discrimination', icon: '✊', color: '#ef4444' },
  { name: 'Inequality', slug: 'inequality', description: 'Stories about social and economic inequality', icon: '⚖️', color: '#f59e0b' },
  { name: 'Social Challenges', slug: 'social-challenges', description: 'Stories about various social challenges', icon: '🌍', color: '#10b981' },
  { name: 'Other', slug: 'other', description: 'Other inspiring stories', icon: '📖', color: '#6366f1' }
];

const stories = [
  {
    title: 'Finding Light in the Darkness',
    content: 'For years, I struggled with depression in silence. I thought asking for help meant I was weak. But when I finally reached out to a therapist, everything changed. This is my journey from darkness to hope, and why I believe mental health should be talked about openly.',
    author: 'Sarah M.',
    category: 'mental-health',
    featured: true,
    likes: 45
  },
  {
    title: 'Breaking Barriers in Tech',
    content: 'As a woman of color in the tech industry, I faced countless moments of being overlooked and underestimated. But I refused to let discrimination define my career. Here is how I found my voice and became a leader in my field.',
    author: 'Priya K.',
    category: 'discrimination',
    featured: true,
    likes: 67
  },
  {
    title: 'From Homeless to College Graduate',
    content: 'Growing up without a stable home, I never imagined I would graduate from college. The inequality I faced was overwhelming, but community support and determination helped me beat the odds. This is my story of resilience.',
    author: 'Marcus J.',
    category: 'inequality',
    featured: true,
    likes: 89
  },
  {
    title: 'Living with Anxiety',
    content: 'Anxiety made simple tasks feel impossible. Going to the grocery store, attending meetings, even answering phone calls filled me with dread. Through therapy and support, I learned to manage my anxiety and reclaim my life.',
    author: 'Anonymous',
    category: 'mental-health',
    featured: false,
    likes: 32
  },
  {
    title: 'Standing Up Against Workplace Harassment',
    content: 'When I reported harassment at my workplace, I was met with dismissal and retaliation. But I did not give up. This is the story of how I fought back and helped change policies that now protect others.',
    author: 'Jennifer L.',
    category: 'discrimination',
    featured: false,
    likes: 54
  },
  {
    title: 'Community Gardens: Growing Together',
    content: 'In our underserved neighborhood, access to fresh food was a luxury. We started a community garden that not only provided food but also brought people together. This project transformed our community.',
    author: 'Community Voices',
    category: 'social-challenges',
    featured: true,
    likes: 41
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Story.deleteMany({});

    // Insert categories
    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Insert stories
    await Story.insertMany(stories);
    console.log('Stories seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

