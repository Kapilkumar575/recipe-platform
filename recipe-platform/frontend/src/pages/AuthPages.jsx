import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAuthStore from '../hooks/useAuthStore';
import { Button, Input, Card } from '../components/common/UI';
import { Mail, Lock, User, AtSign } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, switchText, switchLink, switchLabel }) => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 16px',
    background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%)',
  }}>
    <div style={{ width: '100%', maxWidth: '440px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none',
        }}>
          <span style={{ fontSize: '28px' }}>🍳</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '26px',
            fontWeight: 700, color: 'var(--brown-900)'
          }}>
            Culinara
          </span>
        </Link>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '14px' }}>
          A community for food lovers
        </p>
      </div>

      <Card padding="32px">
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '26px',
          marginBottom: '6px', color: 'var(--brown-900)'
        }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>
          {subtitle}
        </p>
        {children}
        <p style={{
          textAlign: 'center', marginTop: '20px',
          fontSize: '14px', color: 'var(--text-muted)'
        }}>
          {switchText}{' '}
          <Link to={switchLink} style={{ color: 'var(--rust)', fontWeight: 600 }}>
            {switchLabel}
          </Link>
        </p>
      </Card>
    </div>
  </div>
);

// ── Login Page ────────────────────────────────────────
export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError('root', { message: err.message });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue cooking"
      switchText="New to Culinara?"
      switchLink="/register"
      switchLabel="Create an account"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {errors.root && (
          <div style={{
            padding: '10px 14px', background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)', borderRadius: 'var(--radius-sm)',
            color: '#dc2626', fontSize: '13px'
          }}>
            {errors.root.message}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button type="submit" fullWidth loading={isLoading} style={{ marginTop: '8px' }}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}

// ── Register Page ─────────────────────────────────────
export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/');
    } catch (err) {
  setError('root', {
    message: err.response?.data?.message || "Something went wrong"
  });
}
  };

  return (
    <AuthLayout
      title="Join Culinara"
      subtitle="Create an account and start sharing your recipes"
      switchText="Already have an account?"
      switchLink="/login"
      switchLabel="Sign in"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {errors.root && (
          <div style={{
            padding: '10px 14px', background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.25)', borderRadius: 'var(--radius-sm)',
            color: '#dc2626', fontSize: '13px'
          }}>
            {errors.root.message}
          </div>
        )}
        <Input
          label="Full Name"
          placeholder="Jane Smith"
          icon={<User size={15} />}
          error={errors.name?.message}
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
        />
        <Input
          label="Username"
          placeholder="janecooks"
          icon={<AtSign size={15} />}
          error={errors.username?.message}
          hint="Only letters, numbers, and underscores"
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
            pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Invalid characters' }
          })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters with a number"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
            pattern: { value: /\d/, message: 'Must contain a number' }
          })}
        />
        <Button type="submit" fullWidth loading={isLoading} style={{ marginTop: '8px' }}>
          Create Account
        </Button>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
          By joining, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}