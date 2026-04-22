import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--brown-900)',
      color: 'var(--cream)',
      padding: '48px 0 24px',
      marginTop: 'auto',
    }}>
      <div className="container">

        {/* TOP SECTION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>

          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>🍳</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--cream)'
              }}>
                Culinara
              </span>
            </div>

            <p style={{
              color: 'var(--brown-100)',
              fontSize: '14px',
              lineHeight: 1.7
            }}>
              A community for food lovers to discover, share, and celebrate incredible recipes from around the world.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--brown-300)',
              marginBottom: '14px'
            }}>
              Explore
            </h4>

            {[
              { to: '/recipes', label: 'All Recipes' },
              { to: '/recipes?category=dinner', label: 'Dinner Ideas' },
              { to: '/recipes?category=dessert', label: 'Desserts' },
              { to: '/recipes?dietary=vegetarian', label: 'Vegetarian' },
              { to: '/recipes?sort=rating', label: 'Top Rated' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block',
                  color: 'var(--brown-100)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  transition: 'color var(--transition)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Community */}
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--brown-300)',
              marginBottom: '14px'
            }}>
              Community
            </h4>

            {[
              { to: '/register', label: 'Join Us' },
              { to: '/recipes/new', label: 'Share a Recipe' },
              { to: '/dashboard', label: 'My Dashboard' },
              { to: '/saved', label: 'Saved Recipes' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block',
                  color: 'var(--brown-100)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  transition: 'color var(--transition)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>

        {/* BOTTOM SECTION (CENTERED FIX) */}
        <div style={{
          borderTop: '1px solid var(--brown-700)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'center',   // ✅ CENTERED
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}>
          <p style={{
            color: 'var(--brown-300)',
            fontSize: '13px'
          }}>
            © {new Date().getFullYear()} Culinara. Built with 🧡 for food lovers.
          </p>
        </div>

      </div>
    </footer>
  );
}