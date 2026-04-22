import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Button ────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, fullWidth = false,
  className = '', ...props
}) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    outline: 'none',
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: '13px' },
    md: { padding: '10px 22px', fontSize: '15px' },
    lg: { padding: '14px 30px', fontSize: '16px' },
  };

  const variants = {
    primary: {
      background: 'var(--rust)',
      color: 'var(--white)',
      boxShadow: '0 2px 8px rgba(192,68,10,0.3)',
    },
    secondary: {
      background: 'var(--brown-700)',
      color: 'var(--white)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--rust)',
      border: '1.5px solid var(--rust)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: '#dc2626',
      color: 'var(--white)',
    },
  };

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      className={`btn-hover ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────
export const Input = React.forwardRef(({
  label, error, icon, hint, className = '', ...props
}, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{
        fontSize: '13px', fontWeight: 500,
        color: 'var(--text-secondary)', letterSpacing: '0.02em'
      }}>
        {label}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center'
        }}>
          {icon}
        </span>
      )}
      <input
        ref={ref}
        style={{
          width: '100%',
          padding: icon ? '10px 14px 10px 40px' : '10px 14px',
          border: `1.5px solid ${error ? '#dc2626' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--white)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color var(--transition)',
          fontFamily: 'var(--font-body)',
        }}
        className={className}
        {...props}
      />
    </div>
    {error && <p style={{ fontSize: '12px', color: '#dc2626' }}>{error}</p>}
    {hint && !error && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{hint}</p>}
  </div>
));

// ── Textarea ──────────────────────────────────────────
export const Textarea = React.forwardRef(({
  label, error, rows = 4, ...props
}, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      rows={rows}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${error ? '#dc2626' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', background: 'var(--white)',
        color: 'var(--text-primary)', fontSize: '15px',
        outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)',
        lineHeight: 1.6,
      }}
      {...props}
    />
    {error && <p style={{ fontSize: '12px', color: '#dc2626' }}>{error}</p>}
  </div>
));

// ── Select ────────────────────────────────────────────
export const Select = React.forwardRef(({ label, error, children, ...props }, ref) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && (
      <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </label>
    )}
    <select
      ref={ref}
      style={{
        width: '100%', padding: '10px 14px',
        border: `1.5px solid ${error ? '#dc2626' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)', background: 'var(--white)',
        color: 'var(--text-primary)', fontSize: '15px',
        outline: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e7a54' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '36px',
      }}
      {...props}
    >
      {children}
    </select>
    {error && <p style={{ fontSize: '12px', color: '#dc2626' }}>{error}</p>}
  </div>
));

// ── Badge ─────────────────────────────────────────────
export const Badge = ({ children, variant = 'default', size = 'sm', onClick }) => {
  const variants = {
    default: { bg: 'var(--cream-dark)', color: 'var(--text-secondary)' },
    rust: { bg: 'rgba(192,68,10,0.1)', color: 'var(--rust)' },
    sage: { bg: 'rgba(107,143,113,0.15)', color: 'var(--sage)' },
    brown: { bg: 'var(--brown-100)', color: 'var(--brown-700)' },
    dark: { bg: 'var(--brown-900)', color: 'var(--cream)' },
  };
  const v = variants[variant] || variants.default;

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: size === 'sm' ? '3px 10px' : '5px 14px',
        background: v.bg, color: v.color,
        borderRadius: '999px', fontSize: size === 'sm' ? '12px' : '13px',
        fontWeight: 500, cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity var(--transition)',
        userSelect: 'none',
      }}
    >
      {children}
    </span>
  );
};

// ── Spinner ───────────────────────────────────────────
export const Spinner = ({ size = 24, color = 'var(--rust)' }) => (
  <Loader2
    size={size}
    color={color}
    style={{ animation: 'spin 1s linear infinite' }}
  />
);

// ── Card ──────────────────────────────────────────────
export const Card = ({ children, className = '', padding = '24px', ...props }) => (
  <div
    style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border)',
      padding,
    }}
    className={className}
    {...props}
  >
    {children}
  </div>
);

// ── Star Rating Display ───────────────────────────────
export const StarRating = ({ rating = 0, max = 5, size = 16, interactive = false, onChange }) => {
  const [hover, setHover] = React.useState(0);
  const display = hover || rating;

  return (
    <span style={{ display: 'inline-flex', gap: '2px' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= display ? '#f59e0b' : 'var(--border)',
            transition: 'color 0.1s',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

// ── Empty State ───────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 24px', textAlign: 'center', gap: '12px'
  }}>
    {icon && <div style={{ fontSize: '48px', marginBottom: '8px' }}>{icon}</div>}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-primary)' }}>
      {title}
    </h3>
    {description && (
      <p style={{ color: 'var(--text-muted)', maxWidth: '360px', fontSize: '15px' }}>
        {description}
      </p>
    )}
    {action && <div style={{ marginTop: '8px' }}>{action}</div>}
  </div>
);

// ── Avatar ────────────────────────────────────────────
export const Avatar = ({ src, name, size = 40 }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size, height: size,
          borderRadius: '50%', objectFit: 'cover',
          border: '2px solid var(--border)',
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--brown-300)', color: 'var(--white)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};