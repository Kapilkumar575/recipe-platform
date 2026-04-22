import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserProfile, useToggleFollow } from '../hooks/useRecipes';
import useAuthStore from '../hooks/useAuthStore';
import RecipeCard from '../components/recipe/RecipeCard';
import { Avatar, Button, Spinner, EmptyState } from '../components/common/UI';
import { formatDate } from '../utils/helpers';
import { UserPlus, UserCheck, BookOpen, Users } from 'lucide-react';

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const { data, isLoading } = useUserProfile(username);
  const toggleFollow = useToggleFollow(username);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div style={{ padding: '80px 0' }}>
        <EmptyState icon="👤" title="User not found" description="This profile doesn't exist." />
      </div>
    );
  }

  const { user, recipes, isFollowing } = data.data;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div style={{ paddingBottom: '80px' }}>

      {/* ✅ Banner */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(135deg, var(--brown-900), var(--brown-700))'
      }} />

      <div className="container" style={{ marginTop: '30px' }}>

        {/* ✅ Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <Avatar name={user.name} src={user.avatar} size={90} />

          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '700',
              color: 'var(--brown-900)'
            }}>
              {user.name}
            </h1>

            <p style={{ color: 'var(--text-muted)' }}>
              @{user.username}
            </p>

            {user.bio && (
              <p style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
                {user.bio}
              </p>
            )}
          </div>

          {/* ✅ Buttons */}
          {isOwnProfile ? (
            <Link to="/dashboard">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          ) : isAuthenticated() && (
            <Button
              variant={isFollowing ? 'outline' : 'primary'}
              onClick={() => toggleFollow.mutate(user._id)}
              loading={toggleFollow.isPending}
            >
              {isFollowing
                ? <><UserCheck size={16} /> Following</>
                : <><UserPlus size={16} /> Follow</>}
            </Button>
          )}
        </div>

        {/* ✅ Stats */}
        <div style={{
          display: 'flex',
          gap: '30px',
          padding: '18px',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <span><BookOpen size={16} /> {recipes.length} Recipes</span>
          <span><Users size={16} /> {user.followersCount || 0} Followers</span>
          <span><Users size={16} /> {user.followingCount || 0} Following</span>

          <span style={{ marginLeft: 'auto', color: 'gray' }}>
            Joined {formatDate(user.createdAt)}
          </span>
        </div>

        {/* ✅ Recipes Section */}
        <h2 style={{
          fontSize: '22px',
          marginBottom: '20px',
          color: 'var(--brown-900)'
        }}>
          Recipes by {user.name}
        </h2>

        {recipes.length === 0 ? (
          <EmptyState
            icon="🍳"
            title="No recipes yet"
            description={`${user.name} hasn't shared any recipes.`}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}