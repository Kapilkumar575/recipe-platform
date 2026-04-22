import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/UI';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '60px 24px',
    }}>
      <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍳</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '56px',
        color: 'var(--brown-900)', marginBottom: '8px'
      }}>
        404
      </h1>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: '26px',
        color: 'var(--text-secondary)', marginBottom: '12px'
      }}>
        Recipe Not Found
      </h2>
      <p style={{
        color: 'var(--text-muted)', fontSize: '16px',
        maxWidth: '400px', marginBottom: '32px', lineHeight: 1.6
      }}>
        This page doesn't exist or the recipe has been removed.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/"><Button variant="outline">Go Home</Button></Link>
        <Link to="/recipes"><Button variant="primary">Browse Recipes</Button></Link>
      </div>
    </div>
  );
}