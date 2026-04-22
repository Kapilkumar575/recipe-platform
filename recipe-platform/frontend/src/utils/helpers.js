// Format minutes to readable time string
export const formatTime = (minutes) => {
  if (!minutes && minutes !== 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Capitalize first letter
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Truncate string
export const truncate = (str, len = 120) =>
  str && str.length > len ? str.slice(0, len) + '…' : str;

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get image URL (prepend upload base if relative)
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = import.meta.env.VITE_UPLOAD_URL|| 'http://localhost:5000';
  return `${base}${path}`;
};

// Difficulty color
export const difficultyColor = (difficulty) => {
  const map = {
    easy: '#6b8f71',
    medium: '#c4955a',
    hard: '#c0440a',
    expert: '#5c3d20'
  };
  return map[difficulty] || '#9e7a54';
};

// Build query string from object (filter out empty values)
export const buildQuery = (params) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return new URLSearchParams(clean).toString();
};

// Debounce function
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Star rating array
export const starArray = (rating, max = 5) =>
  Array.from({ length: max }, (_, i) => i + 1 <= Math.round(rating));

// Category emojis
export const categoryEmoji = (cat) => {
  const map = {
    breakfast: '🌅', lunch: '🥗', dinner: '🍽️', dessert: '🍰',
    snack: '🧆', appetizer: '🫙', soup: '🍲', salad: '🥙',
    beverage: '🥤', 'side-dish': '🥦', other: '🍴'
  };
  return map[cat] || '🍴';
};

// Cuisine flags / symbols
export const cuisineEmoji = (cuisine) => {
  const map = {
    italian: '🇮🇹', mexican: '🇲🇽', chinese: '🇨🇳', japanese: '🇯🇵',
    indian: '🇮🇳', french: '🇫🇷', mediterranean: '🫒', american: '🇺🇸',
    thai: '🇹🇭', greek: '🇬🇷', spanish: '🇪🇸', 'middle-eastern': '🧆',
    korean: '🇰🇷', vietnamese: '🇻🇳', other: '🌍'
  };
  return map[cuisine] || '🌍';
};