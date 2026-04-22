import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { Button, Badge } from '../common/UI';
import { capitalize } from '../../utils/helpers';

const CATEGORIES = ['breakfast','lunch','dinner','dessert','snack','appetizer','soup','salad','beverage','side-dish','other'];
const CUISINES = ['italian','mexican','chinese','japanese','indian','french','mediterranean','american','thai','greek','spanish','middle-eastern','korean','vietnamese','other'];
const DIFFICULTIES = ['easy','medium','hard','expert'];
const DIETARY = ['vegetarian','vegan','gluten-free','dairy-free','keto','paleo','nut-free','low-carb'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'quick-first', label: 'Quickest' },
];

const FilterSection = ({ title, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <h4 style={{
      fontSize: '12px', fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase', color: 'var(--text-muted)',
      marginBottom: '10px'
    }}>
      {title}
    </h4>
    {children}
  </div>
);

export default function SearchFilters({ filters, onChange, onReset }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  const toggleArray = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated.join(',') || undefined });
  };

  const isSelected = (key, value) => {
    const vals = filters[key] ? filters[key].split(',') : [];
    return vals.includes(value);
  };

  const hasFilters = Object.entries(filters).some(
    ([k, v]) => k !== 'q' && k !== 'page' && k !== 'sort' && v
  );

  return (
    <aside style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      padding: '24px',
      position: 'sticky', top: '80px',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px'
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '18px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <SlidersHorizontal size={16} color="var(--rust)" /> Filters
        </h3>
        {hasFilters && (
          <button
            onClick={onReset}
            style={{
              fontSize: '12px', color: 'var(--rust)',
              cursor: 'pointer', background: 'none', border: 'none',
              fontFamily: 'inherit', fontWeight: 500,
            }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {SORT_OPTIONS.map(opt => (
            <label key={opt.value} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: '14px',
              background: filters.sort === opt.value ? 'rgba(192,68,10,0.06)' : 'transparent',
              color: filters.sort === opt.value ? 'var(--rust)' : 'var(--text-secondary)',
              fontWeight: filters.sort === opt.value ? 500 : 400,
              transition: 'all var(--transition)',
            }}>
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={filters.sort === opt.value}
                onChange={() => update('sort', opt.value)}
                style={{ accentColor: 'var(--rust)' }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              onClick={() => toggleArray('category', cat)}
              style={{
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '12px', cursor: 'pointer',
                fontWeight: 500, transition: 'all var(--transition)',
                background: isSelected('category', cat) ? 'var(--rust)' : 'var(--cream-dark)',
                color: isSelected('category', cat) ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid transparent',
              }}
            >
              {capitalize(cat)}
            </span>
          ))}
        </div>
      </FilterSection>

      {/* Cuisine */}
      <FilterSection title="Cuisine">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {CUISINES.map(c => (
            <span
              key={c}
              onClick={() => toggleArray('cuisine', c)}
              style={{
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                transition: 'all var(--transition)',
                background: isSelected('cuisine', c) ? 'var(--brown-700)' : 'var(--cream-dark)',
                color: isSelected('cuisine', c) ? 'var(--white)' : 'var(--text-secondary)',
              }}
            >
              {capitalize(c)}
            </span>
          ))}
        </div>
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Difficulty">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DIFFICULTIES.map(d => (
            <span
              key={d}
              onClick={() => toggleArray('difficulty', d)}
              style={{
                padding: '4px 14px', borderRadius: '999px',
                fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                transition: 'all var(--transition)',
                background: isSelected('difficulty', d) ? 'var(--sage)' : 'var(--cream-dark)',
                color: isSelected('difficulty', d) ? 'var(--white)' : 'var(--text-secondary)',
              }}
            >
              {capitalize(d)}
            </span>
          ))}
        </div>
      </FilterSection>

      {/* Dietary */}
      <FilterSection title="Dietary">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {DIETARY.map(d => (
            <span
              key={d}
              onClick={() => toggleArray('dietary', d)}
              style={{
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                transition: 'all var(--transition)',
                background: isSelected('dietary', d) ? 'var(--sage)' : 'var(--cream-dark)',
                color: isSelected('dietary', d) ? 'var(--white)' : 'var(--text-secondary)',
              }}
            >
              {d.replace('-', ' ')}
            </span>
          ))}
        </div>
      </FilterSection>

      {/* Max time */}
      <FilterSection title="Max Total Time (minutes)">
        <input
          type="range" min="15" max="240" step="15"
          value={filters.maxTime || 240}
          onChange={(e) => update('maxTime', e.target.value === '240' ? undefined : e.target.value)}
          style={{ width: '100%', accentColor: 'var(--rust)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>15m</span>
          <span style={{ color: 'var(--rust)', fontWeight: 500 }}>
            {filters.maxTime ? `≤ ${filters.maxTime}m` : 'Any'}
          </span>
          <span>4h</span>
        </div>
      </FilterSection>

      {/* Min rating */}
      <FilterSection title="Minimum Rating">
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <span
              key={r}
              onClick={() => update('minRating', r === 0 ? undefined : r)}
              style={{
                padding: '4px 10px', borderRadius: '999px',
                fontSize: '12px', cursor: 'pointer', fontWeight: 500,
                background: (filters.minRating == r || (!filters.minRating && r === 0))
                  ? '#f59e0b' : 'var(--cream-dark)',
                color: (filters.minRating == r || (!filters.minRating && r === 0))
                  ? 'var(--white)' : 'var(--text-secondary)',
              }}
            >
              {r === 0 ? 'Any' : `★ ${r}+`}
            </span>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}