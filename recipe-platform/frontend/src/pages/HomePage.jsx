import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Zap, Heart } from 'lucide-react';
import { useFeaturedRecipes, usePopularTags } from '../hooks/useRecipes';
import RecipeCard from '../components/recipe/RecipeCard';
import { Spinner, EmptyState } from '../components/common/UI';
import { capitalize } from '../utils/helpers';

const CATEGORY_LINKS = [
  { label: 'Breakfast', emoji: '🌅', value: 'breakfast' },
  { label: 'Lunch', emoji: '🥗', value: 'lunch' },
  { label: 'Dinner', emoji: '🍽️', value: 'dinner' },
  { label: 'Desserts', emoji: '🍰', value: 'dessert' },
  { label: 'Soups', emoji: '🍲', value: 'soup' },
  { label: 'Snacks', emoji: '🧆', value: 'snack' },
];

const CUISINE_LINKS = [
  { label: 'Italian', emoji: '🇮🇹', value: 'italian' },
  { label: 'Mexican', emoji: '🇲🇽', value: 'mexican' },
  { label: 'Japanese', emoji: '🇯🇵', value: 'japanese' },
  { label: 'Indian', emoji: '🇮🇳', value: 'indian' },
  { label: 'French', emoji: '🇫🇷', value: 'french' },
  { label: 'Thai', emoji: '🇹🇭', value: 'thai' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = React.useState('');
  const { data: featured, isLoading: featLoading } = useFeaturedRecipes();
  const { data: tagsData } = usePopularTags();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) navigate(`/recipes?q=${encodeURIComponent(heroSearch)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown-900) 0%, var(--brown-700) 50%, var(--brown-500) 100%)',
        padding: '80px 0 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[
          { size: 300, top: '-80px', right: '-40px', opacity: 0.06 },
          { size: 200, bottom: '-60px', left: '5%', opacity: 0.05 },
          { size: 150, top: '40%', left: '20%', opacity: 0.04 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.size, height: c.size,
            borderRadius: '50%', background: 'var(--cream)',
            opacity: c.opacity, top: c.top, bottom: c.bottom,
            left: c.left, right: c.right,
          }} />
        ))}

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.1)', borderRadius: '999px',
            padding: '6px 16px', marginBottom: '24px',
          }}>
            <span style={{ fontSize: '14px' }}>✨</span>
            <span style={{ color: 'var(--brown-100)', fontSize: '13px', fontWeight: 500 }}>
              Thousands of recipes from home cooks worldwide
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 700, color: 'var(--cream)',
            lineHeight: 1.1, marginBottom: '16px',
          }}>
            Find Your Next<br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(90deg, var(--brown-300), var(--rust-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Favourite Recipe
            </span>
          </h1>

          <p style={{
            color: 'var(--brown-100)', fontSize: '18px',
            maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            Discover, share, and cook amazing recipes from chefs and home cooks around the world.
          </p>

          {/* Search */}
          <form onSubmit={handleHeroSearch} style={{
            display: 'flex', maxWidth: '560px', margin: '0 auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{
                position: 'absolute', left: '16px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search pasta, vegan, 30 minute meals…"
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  border: 'none', fontSize: '16px', outline: 'none',
                  fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
                  background: 'var(--white)',
                }}
              />
            </div>
            <button type="submit" style={{
              padding: '16px 28px', background: 'var(--rust)',
              color: 'white', border: 'none', cursor: 'pointer',
              fontSize: '16px', fontWeight: 600, transition: 'background var(--transition)',
              fontFamily: 'var(--font-body)',
            }}>
              Search
            </button>
          </form>

          {/* Quick tags */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['pasta', 'chicken', 'vegan', 'quick', 'healthy', 'dessert'].map(tag => (
              <Link
                key={tag}
                to={`/recipes?q=${tag}`}
                style={{
                  padding: '5px 14px', borderRadius: '999px',
                  background: 'rgba(255,255,255,0.12)', color: 'var(--brown-100)',
                  fontSize: '13px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all var(--transition)',
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: 'var(--cream-dark)', borderBottom: '1px solid var(--border)',
        padding: '20px 0',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap'
        }}>
          {[
            { icon: <TrendingUp size={16} />, label: '10,000+ Recipes' },
            { icon: <Heart size={16} />, label: '500+ Home Cooks' },
            { icon: <Zap size={16} />, label: '50+ Cuisines' },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500,
            }}>
              <span style={{ color: 'var(--rust)' }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Category grid */}
      <section style={{ padding: '64px 0 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '34px',
              color: 'var(--brown-900)', marginBottom: '8px'
            }}>
              Browse by Category
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              From quick breakfasts to elaborate dinners
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {CATEGORY_LINKS.map(cat => (
              <Link
                key={cat.value}
                to={`/recipes?category=${cat.value}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '10px', padding: '24px 16px',
                  background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', textDecoration: 'none',
                  transition: 'all 0.2s ease', color: 'var(--text-primary)',
                }}
                className="category-card"
              >
                <span style={{ fontSize: '36px' }}>{cat.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured recipes */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '34px',
                color: 'var(--brown-900)', marginBottom: '6px'
              }}>
                Featured Recipes
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                Hand-picked by our editors
              </p>
            </div>
            <Link to="/recipes?sort=rating" style={{
              color: 'var(--rust)', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              View All →
            </Link>
          </div>

          {featLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Spinner size={32} />
            </div>
          ) : featured?.data?.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {featured.data.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🍽️"
              title="No featured recipes yet"
              description="Check back soon for our editor's picks."
              action={<Link to="/recipes" style={{ color: 'var(--rust)', fontWeight: 600 }}>Browse All Recipes →</Link>}
            />
          )}
        </div>
      </section>

      {/* Cuisines */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', marginBottom: '8px' }}>
              Explore by Cuisine
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {CUISINE_LINKS.map(c => (
              <Link
                key={c.value}
                to={`/recipes?cuisine=${c.value}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '14px 16px',
                  background: 'var(--white)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', textDecoration: 'none',
                  color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '22px' }}>{c.emoji}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--rust) 0%, var(--brown-700) 100%)',
        padding: '64px 0', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '38px',
            color: 'var(--cream)', marginBottom: '12px'
          }}>
            Share Your Recipes with the World
          </h2>
          <p style={{
            color: 'rgba(253,246,238,0.8)', fontSize: '16px',
            maxWidth: '460px', margin: '0 auto 28px',
          }}>
            Join our community of passionate cooks and share what you love to make.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', background: 'var(--cream)',
              color: 'var(--rust)', borderRadius: 'var(--radius-md)',
              fontWeight: 700, fontSize: '16px', textDecoration: 'none',
              transition: 'all var(--transition)',
            }}
          >
            Get Started – It's Free ✨
          </Link>
        </div>
      </section>
    </div>
  );
}