import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateRecipe, useUpdateRecipe, useRecipe } from '../hooks/useRecipes';
import RecipeForm from '../components/recipe/RecipeForm';
import { Spinner } from '../components/common/UI';

// ── Create Recipe Page ────────────────────────────────
export function CreateRecipePage() {
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const handleSubmit = async (data) => {
    const result = await createRecipe.mutateAsync(data);
    if (result?.data?.slug) {
      navigate(`/recipes/${result.data.slug}`);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px',
            color: 'var(--brown-900)', marginBottom: '6px'
          }}>
            Share Your Recipe
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
            Fill in the details below and share your creation with the community.
          </p>
        </div>
        <RecipeForm
          onSubmit={handleSubmit}
          isLoading={createRecipe.isPending}
        />
      </div>
    </div>
  );
}

// ── Edit Recipe Page ──────────────────────────────────
export function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useRecipe(id);
  const updateRecipe = useUpdateRecipe(id);

  const handleSubmit = async (data) => {
    const result = await updateRecipe.mutateAsync(data);
    if (result?.data?.slug) {
      navigate(`/recipes/${result.data.slug}`);
    }
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
      <Spinner size={36} />
    </div>
  );

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '36px',
            color: 'var(--brown-900)', marginBottom: '6px'
          }}>
            Edit Recipe
          </h1>
        </div>
        <RecipeForm
          defaultValues={data?.data}
          onSubmit={handleSubmit}
          isLoading={updateRecipe.isPending}
        />
      </div>
    </div>
  );
}