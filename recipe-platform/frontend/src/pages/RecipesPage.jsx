import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/recipe/RecipeCard';
import SearchFilters from '../components/search/SearchFilters';
import { EmptyState, Button } from '../components/common/UI';
import { debounce } from '../utils/helpers';

const SkeletonCard = () => (
  <div style={{
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    background: 'var(--white)',
  }}>
    <div className="skeleton" style={{ aspectRatio: '4/3' }} />
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="skeleton" style={{ height: '20px', width: '70%' }} />
      <div className="skeleton" style={{ height: '14px', width: '90%' }} />
      <div className="skeleton" style={{ height: '14px', width: '50%' }} />
    </div>
  </div>
);

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const filters = Object.fromEntries(searchParams.entries());

  const { data, isLoading, isError } = useRecipes({
    ...filters,
    limit: 12,
  });

  // 🔥 FIXED DATA EXTRACTION (handles ALL backend formats)
  const recipes =
    data?.data?.recipes ||   // { data: { recipes: [] } }
    data?.data ||            // { data: [] }
    data ||                  // []
    [];
    console.log("RECIPES DATA 👉", recipes);

  const pagination =
    data?.data?.pagination ||
    data?.pagination ||
    null;

  // 🔍 Debounced search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (val) next.set('q', val);
        else next.delete('q');
        next.set('page', '1');
        return next;
      });
    }, 500),
    [setSearchParams]
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    const cleaned = Object.fromEntries(
      Object.entries(newFilters).filter(([, v]) => v)
    );
    setSearchParams({ ...cleaned, page: '1' });
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const goToPage = (page) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', page);
      return next;
    });
  };

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">

        {/* Header */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          marginBottom: '20px'
        }}>
          {filters.q ? `Results for "${filters.q}"` : 'Explore Recipes'}
        </h1>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '500px', marginBottom: '30px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search recipes..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }}>

          {/* Filters */}
          <SearchFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* Content */}
          <div>

            {/* Loading */}
            {isLoading && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <EmptyState
                icon="⚠️"
                title="Error loading recipes"
                action={<Button onClick={() => window.location.reload()}>Retry</Button>}
              />
            )}

            {/* Empty */}
            {!isLoading && recipes.length === 0 && (
              <EmptyState
                icon="🔍"
                title="No recipes found"
                description="Try different filters or search."
                action={<Button onClick={handleReset}>Clear Filters</Button>}
              />
            )}

            {/* ✅ REAL RECIPES GRID */}
            {!isLoading && recipes.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                    <Button
                      disabled={!pagination.hasPrev}
                      onClick={() => goToPage(pagination.page - 1)}
                    >
                      Prev
                    </Button>

                    <Button
                      disabled={!pagination.hasNext}
                      onClick={() => goToPage(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}