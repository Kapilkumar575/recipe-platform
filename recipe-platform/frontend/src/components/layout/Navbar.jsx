import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, BookOpen, Heart, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore';
import { Avatar, Button } from '../common/UI';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(253,246,238,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '64px', gap: '16px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '22px' }}>🍳</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '22px',
            fontWeight: 700, color: 'var(--brown-900)',
            letterSpacing: '-0.01em'
          }}>
            Culinara
          </span>
        </Link>

        {/* Search bar (desktop) */}
        <form onSubmit={handleSearch} style={{
          flex: 1, maxWidth: '480px', display: 'flex',
          gap: '0', position: 'relative'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-muted)'
            }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, cuisines…"
              style={{
                width: '100%', padding: '9px 14px 9px 38px',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                background: 'var(--white)', fontSize: '14px',
                outline: 'none', fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '9px 18px',
            background: 'var(--rust)', color: 'var(--white)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            border: 'none', cursor: 'pointer', fontSize: '14px',
            fontWeight: 500, transition: 'background var(--transition)',
          }}>
            Search
          </button>
        </form>

        {/* Desktop nav actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/recipes" style={{
            padding: '8px 14px', color: 'var(--text-secondary)',
            fontWeight: 500, fontSize: '14px', borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <BookOpen size={15} /> Recipes
          </Link>

          {isAuthenticated() ? (
            <>
              <Link to="/recipes/new">
                <Button size="sm" variant="primary">
                  <Plus size={14} /> Add Recipe
                </Button>
              </Link>

              {/* User dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 8px 4px 4px',
                    border: '1.5px solid var(--border)',
                    borderRadius: '999px', cursor: 'pointer',
                    background: 'var(--white)', transition: 'all var(--transition)',
                  }}
                >
                  <Avatar name={user?.name} src={user?.avatar} size={30} />
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--white)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
                    minWidth: '200px', overflow: 'hidden', zIndex: 200,
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <p style={{ fontWeight: 600, fontSize: '14px' }}>{user?.name}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{user?.username}</p>
                    </div>
                    {[
                      { to: `/user/${user?.username}`, icon: <User size={14} />, label: 'My Profile' },
                      { to: '/dashboard', icon: <BookOpen size={14} />, label: 'My Recipes' },
                      { to: '/saved', icon: <Heart size={14} />, label: 'Saved Recipes' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 16px', fontSize: '14px',
                          color: 'var(--text-secondary)', transition: 'background var(--transition)',
                        }}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 16px', fontSize: '14px', color: '#dc2626',
                        borderTop: '1px solid var(--border)', cursor: 'pointer',
                        background: 'none', border: 'none', fontFamily: 'inherit',
                        transition: 'background var(--transition)',
                      }}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}