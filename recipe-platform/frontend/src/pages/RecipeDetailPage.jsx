import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock, Users, ChefHat, Star, Bookmark, BookmarkCheck,
  Edit, Trash2, Share2, ArrowLeft
} from 'lucide-react';
import { useRecipe, useSimilarRecipes, useToggleSave, useDeleteRecipe, useAddReview } from '../hooks/useRecipes';
import useAuthStore from '../hooks/useAuthStore';
import RecipeCard from '../components/recipe/RecipeCard';
import {
  Button, Badge, StarRating, Avatar, Spinner, EmptyState, Card
} from '../components/common/UI';
import {
  formatTime, capitalize, formatDate, getImageUrl, difficultyColor
} from '../utils/helpers';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { data, isLoading } = useRecipe(slug);
  const recipe = data?.data;

  const toggleSave = useToggleSave();
  const deleteRecipe = useDeleteRecipe();
  const addReview = useAddReview(recipe?._id);

  const { data: similar } = useSimilarRecipes(recipe?._id);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');
  const [checkedSteps, setCheckedSteps] = useState(new Set());

  const isAuthor = user?._id === recipe?.author?._id;
  const hasReviewed = recipe?.reviews?.some(r => r.user?._id === user?._id);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    await deleteRecipe.mutateAsync(recipe._id);
    navigate('/dashboard');
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: recipe.title, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) return toast.error('Please select a rating');
    await addReview.mutateAsync({ rating: reviewRating, comment: reviewComment });
    setReviewRating(0);
    setReviewComment('');
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
      <Spinner size={40} />
    </div>
  );

  if (!recipe) return (
    <div style={{ padding: '80px 0' }}>
      <EmptyState icon="🔍" title="Recipe not found" description="This recipe may have been deleted."
        action={<Link to="/recipes"><Button>Browse Recipes</Button></Link>} />
    </div>
  );

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div>
      {/* Hero image */}
      <div style={{
        position: 'relative', height: 'clamp(300px, 50vh, 520px)',
        background: 'var(--brown-900)', overflow: 'hidden',
      }}>
        {recipe.image ? (
          <img
            src={getImageUrl(recipe.image)}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '80px' }}>
            🍽️
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,10,0,0.9) 0%, rgba(26,10,0,0.2) 60%, transparent 100%)'
        }} />

        {/* Back button */}
        <Link to="/recipes" style={{
          position: 'absolute', top: '20px', left: '20px',
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-md)',
          fontSize: '13px', fontWeight: 500,
        }}>
          <ArrowLeft size={14} /> Recipes
        </Link>

        {/* Action buttons */}
        <div style={{
          position: 'absolute', top: '20px', right: '20px',
          display: 'flex', gap: '8px',
        }}>
          <button onClick={handleShare} style={{
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            border: 'none', color: 'white', padding: '8px',
            borderRadius: '50%', cursor: 'pointer', display: 'flex',
          }}>
            <Share2 size={16} />
          </button>
          {isAuthenticated() && (
            <button onClick={() => toggleSave.mutate(recipe._id)} style={{
              background: data.data?.isSaved ? 'var(--rust)' : 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: 'none', color: 'white', padding: '8px',
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
            }}>
              {data.data?.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
          {isAuthor && (
            <>
              <Link to={`/recipes/${recipe._id}/edit`} style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                color: 'white', padding: '8px', borderRadius: '50%',
                display: 'flex', alignItems: 'center',
              }}>
                <Edit size={16} />
              </Link>
              <button onClick={handleDelete} style={{
                background: 'rgba(220,38,38,0.7)', backdropFilter: 'blur(8px)',
                border: 'none', color: 'white', padding: '8px',
                borderRadius: '50%', cursor: 'pointer', display: 'flex',
              }}>
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0 }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <Badge variant="dark">{capitalize(recipe.category)}</Badge>
              <Badge variant="dark">{capitalize(recipe.cuisine)}</Badge>
              {recipe.dietary?.map(d => (
                <Badge key={d} variant="sage">{d}</Badge>
              ))}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 44px)',
              fontWeight: 700, color: 'var(--cream)', lineHeight: 1.1,
              maxWidth: '800px',
            }}>
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '36px', alignItems: 'start' }}>

          {/* Main content */}
          <div>
            {/* Meta strip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
              padding: '20px', background: 'var(--white)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)', marginBottom: '28px',
            }}>
              {[
                { icon: <Clock size={16} />, label: 'Prep', value: formatTime(recipe.prepTime) },
                { icon: <ChefHat size={16} />, label: 'Cook', value: formatTime(recipe.cookTime) },
                { icon: <Clock size={16} />, label: 'Total', value: formatTime(totalTime) },
                { icon: <Users size={16} />, label: 'Serves', value: recipe.servings },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rust)', marginBottom: '2px', justifyContent: 'center' }}>
                    {icon} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--brown-900)' }}>{value}</span>
                </div>
              ))}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Difficulty</div>
                <span style={{ fontWeight: 700, fontSize: '16px', color: difficultyColor(recipe.difficulty) }}>
                  {capitalize(recipe.difficulty)}
                </span>
              </div>
              {recipe.averageRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarRating rating={recipe.averageRating} size={16} />
                  <span style={{ fontWeight: 600, color: 'var(--brown-900)' }}>{recipe.averageRating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>({recipe.reviewCount})</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)',
              marginBottom: '28px'
            }}>
              {recipe.description}
            </p>

            {/* Tabs */}
            <div style={{
              display: 'flex', borderBottom: '2px solid var(--border)',
              marginBottom: '28px', gap: '4px'
            }}>
              {['ingredients', 'instructions', 'nutrition'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px', border: 'none', background: 'none',
                    fontFamily: 'var(--font-body)', fontSize: '15px',
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? 'var(--rust)' : 'var(--text-muted)',
                    borderBottom: `2px solid ${activeTab === tab ? 'var(--rust)' : 'transparent'}`,
                    marginBottom: '-2px', cursor: 'pointer', textTransform: 'capitalize',
                    transition: 'all var(--transition)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Ingredients tab */}
            {activeTab === 'ingredients' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                  {recipe.ingredients?.map((ing, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', background: 'var(--cream)',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--rust)', flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--brown-700)', minWidth: '60px' }}>
                        {ing.amount} {ing.unit}
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{ing.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions tab */}
            {activeTab === 'instructions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.2s ease' }}>
                {recipe.instructions?.map((inst, i) => (
                  <div
                    key={i}
                    onClick={() => setCheckedSteps(prev => {
                      const next = new Set(prev);
                      next.has(i) ? next.delete(i) : next.add(i);
                      return next;
                    })}
                    style={{
                      display: 'flex', gap: '16px', padding: '18px',
                      background: checkedSteps.has(i) ? 'var(--cream-dark)' : 'var(--white)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', transition: 'all var(--transition)',
                      opacity: checkedSteps.has(i) ? 0.65 : 1,
                    }}
                  >
                    <div style={{
                      flexShrink: 0, width: '36px', height: '36px',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700, fontSize: '15px',
                      background: checkedSteps.has(i) ? 'var(--sage)' : 'var(--rust)',
                      color: 'white', transition: 'background var(--transition)',
                    }}>
                      {checkedSteps.has(i) ? '✓' : inst.step}
                    </div>
                    <p style={{
                      fontSize: '15px', lineHeight: 1.7, color: 'var(--text-primary)',
                      textDecoration: checkedSteps.has(i) ? 'line-through' : 'none',
                    }}>
                      {inst.text}
                    </p>
                  </div>
                ))}
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                  Click a step to mark it as done
                </p>
              </div>
            )}

            {/* Nutrition tab */}
            {activeTab === 'nutrition' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                {recipe.nutrition && Object.values(recipe.nutrition).some(Boolean) ? (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '12px'
                  }}>
                    {[
                      { label: 'Calories', value: recipe.nutrition.calories ? `${recipe.nutrition.calories} kcal` : null },
                      { label: 'Protein', value: recipe.nutrition.protein },
                      { label: 'Carbohydrates', value: recipe.nutrition.carbohydrates },
                      { label: 'Fat', value: recipe.nutrition.fat },
                      { label: 'Fiber', value: recipe.nutrition.fiber },
                    ].filter(n => n.value).map(n => (
                      <div key={n.label} style={{
                        padding: '16px', background: 'var(--cream)',
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                        textAlign: 'center'
                      }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          {n.label}
                        </p>
                        <p style={{ fontWeight: 700, fontSize: '18px', color: 'var(--brown-900)' }}>
                          {n.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    No nutrition information provided for this recipe.
                  </p>
                )}
              </div>
            )}

            {/* Reviews */}
            <div style={{ marginTop: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '24px' }}>
                Reviews {recipe.reviewCount > 0 && `(${recipe.reviewCount})`}
              </h2>

              {/* Add review form */}
              {isAuthenticated() && !isAuthor && !hasReviewed && (
                <Card style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                    Write a Review
                  </h3>
                  <form onSubmit={handleReview}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                        Your Rating *
                      </label>
                      <StarRating rating={reviewRating} size={28} interactive onChange={setReviewRating} />
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this recipe…"
                      rows={3}
                      style={{
                        width: '100%', padding: '10px 14px',
                        border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        fontSize: '14px', fontFamily: 'var(--font-body)',
                        outline: 'none', resize: 'vertical', marginBottom: '12px',
                      }}
                    />
                    <Button type="submit" loading={addReview.isPending} disabled={!reviewRating}>
                      Submit Review
                    </Button>
                  </form>
                </Card>
              )}

              {/* Reviews list */}
              {recipe.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recipe.reviews.map((review, i) => (
                    <div key={i} style={{
                      padding: '18px', background: 'var(--white)',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Avatar name={review.user?.name} src={review.user?.avatar} size={36} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '14px' }}>{review.user?.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{review.user?.username}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <StarRating rating={review.rating} size={14} />
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  No reviews yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Author */}
            <Card>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '12px' }}>
                Recipe by
              </h3>
              <Link
                to={`/user/${recipe.author?.username}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
              >
                <Avatar name={recipe.author?.name} src={recipe.author?.avatar} size={48} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--brown-900)' }}>
                    {recipe.author?.name}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    @{recipe.author?.username}
                  </p>
                </div>
              </Link>
              {recipe.author?.bio && (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
                  {recipe.author.bio}
                </p>
              )}
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
                Published {formatDate(recipe.createdAt)}
              </p>
            </Card>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <Card>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Tags
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {recipe.tags.map(tag => (
                    <Link key={tag} to={`/recipes?tags=${tag}`}>
                      <Badge variant="brown">#{tag}</Badge>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Similar recipes */}
            {similar?.data?.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '14px' }}>
                  You Might Like
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {similar.data.map(r => (
                    <RecipeCard key={r._id} recipe={r} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}