import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatTime, difficultyColor, capitalize, truncate, getImageUrl } from '../../utils/helpers';
import { Badge, Avatar } from '../common/UI';
import { useToggleSave } from '../../hooks/useRecipes';
import useAuthStore from '../../hooks/useAuthStore';

export default function RecipeCard({ recipe, compact = false }) {
  const { isAuthenticated } = useAuthStore();
  const toggleSave = useToggleSave();

  if (!recipe) return null;

  const {
    _id, title, slug, image, description, author,
    prepTime, cookTime, servings, difficulty,
    averageRating, reviewCount, category, cuisine, savedBy
  } = recipe;

  const totalTime = (prepTime || 0) + (cookTime || 0);
  const isSaved = savedBy?.length > 0; // Simplified; real app checks user ID

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) return;
    toggleSave.mutate(_id);
  };

  return (
    <Link
      to={`/recipes/${slug}`}
      style={{
        display: 'block',
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.25s ease',
        textDecoration: 'none',
        color: 'inherit',
      }}
      className="recipe-card"
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: compact ? '3/2' : '4/3',
        overflow: 'hidden',
        background: 'var(--cream-dark)',
      }}>
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="recipe-card-img"
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px',
          }}>
            🍽️
          </div>
        )}

        {/* Overlay badges */}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          display: 'flex', flexDirection: 'column', gap: '4px'
        }}>
          <Badge variant="dark" size="sm">{capitalize(category)}</Badge>
        </div>

        {/* Save button */}
        {isAuthenticated() && (
          <button
            onClick={handleSave}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all var(--transition)',
              color: isSaved ? 'var(--rust)' : 'var(--text-muted)',
            }}
          >
            {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        )}

        {/* Rating chip */}
        {averageRating > 0 && (
          <div style={{
            position: 'absolute', bottom: '10px', right: '10px',
            background: 'rgba(26,10,0,0.8)', color: 'var(--cream)',
            borderRadius: '999px', padding: '3px 10px',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 600,
          }}>
            <Star size={11} fill="currentColor" color="#f59e0b" />
            {averageRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: compact ? '14px' : '18px' }}>
        {/* Author */}
        {author && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '8px',
          }}>
            <Avatar name={author.name} src={author.avatar} size={22} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              @{author.username}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: compact ? '16px' : '18px',
          fontWeight: 700, lineHeight: 1.3,
          color: 'var(--text-primary)',
          marginBottom: '6px',
        }}>
          {title}
        </h3>

        {/* Description (non-compact) */}
        {!compact && description && (
          <p style={{
            fontSize: '13px', color: 'var(--text-muted)',
            lineHeight: 1.6, marginBottom: '12px',
          }}>
            {truncate(description, 90)}
          </p>
        )}

        {/* Meta row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', flexWrap: 'wrap',
          fontSize: '12px', color: 'var(--text-secondary)',
          marginTop: compact ? '6px' : '0',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {formatTime(totalTime)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> {servings} servings
          </span>
          {difficulty && (
            <span style={{
              color: difficultyColor(difficulty),
              fontWeight: 500,
            }}>
              {capitalize(difficulty)}
            </span>
          )}
          {reviewCount > 0 && (
            <span style={{ color: 'var(--text-muted)' }}>
              {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}