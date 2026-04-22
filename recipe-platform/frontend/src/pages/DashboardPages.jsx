import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useMyRecipes, useDeleteRecipe, useSavedRecipes } from '../hooks/useRecipes';
import useAuthStore from '../hooks/useAuthStore';
import RecipeCard from '../components/recipe/RecipeCard';
import { Button, Spinner, EmptyState, Badge, Avatar } from '../components/common/UI';
import { formatDate, capitalize } from '../utils/helpers';

// ── Dashboard Page ─────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useMyRecipes();
  const deleteRecipe = useDeleteRecipe();
  const recipes = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    await deleteRecipe.mutateAsync(id);
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap', gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar name={user?.name} src={user?.avatar} size={56} />
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '28px',
                color: 'var(--brown-900)', marginBottom: '4px'
              }}>
                My Recipes
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                @{user?.username} · {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link to="/recipes/new">
            <Button variant="primary">
              <Plus size={16} /> New Recipe
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size={32} />
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            icon="👨‍🍳"
            title="No recipes yet"
            description="You haven't shared any recipes. Start sharing your culinary creations!"
            action={
              <Link to="/recipes/new">
                <Button variant="primary"><Plus size={16} /> Create First Recipe</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recipes.map(recipe => (
              <div key={recipe._id} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px', background: 'var(--white)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                transition: 'box-shadow var(--transition)',
              }}>
                {/* Image */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: 'var(--radius-md)',
                  overflow: 'hidden', flexShrink: 0,
                  background: 'var(--cream-dark)',
                }}>
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '28px' }}>
                      🍽️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontWeight: 600, fontSize: '16px', marginBottom: '4px',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {recipe.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge variant="default">{capitalize(recipe.category)}</Badge>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {formatDate(recipe.createdAt)}
                    </span>
                    {recipe.averageRating > 0 && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        ★ {recipe.averageRating.toFixed(1)} ({recipe.reviewCount})
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      👁 {recipe.viewCount || 0} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <Link to={`/recipes/${recipe.slug}`}>
                    <button style={{
                      padding: '7px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', color: 'var(--text-secondary)', background: 'white',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Eye size={15} />
                    </button>
                  </Link>
                  <Link to={`/recipes/${recipe._id}/edit`}>
                    <button style={{
                      padding: '7px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', color: 'var(--brown-500)', background: 'white',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Edit size={15} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe._id)}
                    style={{
                      padding: '7px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', color: '#dc2626', background: 'white',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Saved Recipes Page ─────────────────────────────────
export function SavedRecipesPage() {
  const { data, isLoading } = useSavedRecipes();
  const recipes = data?.data || [];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '32px',
            color: 'var(--brown-900)', marginBottom: '6px'
          }}>
            Saved Recipes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size={32} />
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No saved recipes"
            description="Browse recipes and bookmark the ones you want to cook later."
            action={<Link to="/recipes"><Button variant="primary">Explore Recipes</Button></Link>}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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