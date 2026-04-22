import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Upload, GripVertical, ChevronDown } from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, Spinner } from '../common/UI';
import { useUploadImage } from '../../hooks/useRecipes';
import { getImageUrl } from '../../utils/helpers';

const CATEGORIES = ['breakfast','lunch','dinner','dessert','snack','appetizer','soup','salad','beverage','side-dish','other'];
const CUISINES = ['italian','mexican','chinese','japanese','indian','french','mediterranean','american','thai','greek','spanish','middle-eastern','korean','vietnamese','other'];
const DIFFICULTIES = ['easy','medium','hard','expert'];
const DIETARY = ['vegetarian','vegan','gluten-free','dairy-free','keto','paleo','nut-free','low-carb'];

export default function RecipeForm({ defaultValues, onSubmit, isLoading }) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.image || '');
  const [selectedDietary, setSelectedDietary] = useState(defaultValues?.dietary || []);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(defaultValues?.tags || []);

  const uploadImage = useUploadImage();

  const {
    register, handleSubmit, control,
    formState: { errors }, setValue, watch
  } = useForm({
    defaultValues: {
      ...defaultValues,
      ingredients: defaultValues?.ingredients || [{ name: '', amount: '', unit: '' }],
      instructions: defaultValues?.instructions || [{ text: '' }],
    }
  });

  const { fields: ingFields, append: addIng, remove: removeIng } = useFieldArray({ control, name: 'ingredients' });
  const { fields: instFields, append: addInst, remove: removeInst } = useFieldArray({ control, name: 'instructions' });

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage.mutateAsync(file);
    if (result?.data?.url) {
      setImageUrl(result.data.url);
      setValue('image', result.data.url);
    }
  }, [uploadImage, setValue]);

  const toggleDietary = (item) => {
    const updated = selectedDietary.includes(item)
      ? selectedDietary.filter(d => d !== item)
      : [...selectedDietary, item];
    setSelectedDietary(updated);
    setValue('dietary', updated);
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!tags.includes(tag)) {
        const updated = [...tags, tag];
        setTags(updated);
        setValue('tags', updated);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    const updated = tags.filter(t => t !== tag);
    setTags(updated);
    setValue('tags', updated);
  };

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, dietary: selectedDietary, tags });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div style={{ display: 'grid', gap: '32px' }}>

        {/* Basic Info */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px', color: 'var(--brown-900)' }}>
            Basic Information
          </h2>
          <div style={{ display: 'grid', gap: '18px' }}>
            <Input
              label="Recipe Title *"
              placeholder="e.g. Grandma's Spaghetti Carbonara"
              error={errors.title?.message}
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Too short' } })}
            />
            <Textarea
              label="Description *"
              placeholder="Tell us about your recipe…"
              rows={3}
              error={errors.description?.message}
              {...register('description', { required: 'Description is required' })}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              <Select label="Category *" error={errors.category?.message} {...register('category', { required: true })}>
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
              </Select>
              <Select label="Cuisine *" error={errors.cuisine?.message} {...register('cuisine', { required: true })}>
                <option value="">Select…</option>
                {CUISINES.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
              </Select>
              <Select label="Difficulty *" error={errors.difficulty?.message} {...register('difficulty', { required: true })}>
                <option value="">Select…</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Input label="Prep Time (min) *" type="number" min="0" error={errors.prepTime?.message}
                {...register('prepTime', { required: true, min: 0, valueAsNumber: true })} />
              <Input label="Cook Time (min) *" type="number" min="0" error={errors.cookTime?.message}
                {...register('cookTime', { required: true, min: 0, valueAsNumber: true })} />
              <Input label="Servings *" type="number" min="1" error={errors.servings?.message}
                {...register('servings', { required: true, min: 1, valueAsNumber: true })} />
            </div>
          </div>
        </section>

        {/* Image Upload */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>Photo</h2>
          <div style={{
            border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
            padding: '32px', textAlign: 'center', position: 'relative',
            background: imageUrl ? 'transparent' : 'var(--cream)',
            overflow: 'hidden',
          }}>
            {imageUrl ? (
              <div style={{ position: 'relative' }}>
                <img src={getImageUrl(imageUrl)} alt="Preview" style={{
                  maxHeight: '280px', borderRadius: 'var(--radius-md)',
                  objectFit: 'cover', margin: '0 auto',
                }} />
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); setValue('image', ''); }}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    border: 'none', borderRadius: '50%', width: '28px',
                    height: '28px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <Upload size={32} color="var(--brown-300)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>
                  Drop an image here or click to upload
                </p>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '8px 20px', background: 'var(--rust)', color: 'white',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                }}>
                  {uploadImage.isPending ? <Spinner size={14} color="white" /> : <Upload size={14} />}
                  {uploadImage.isPending ? 'Uploading…' : 'Choose File'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              </>
            )}
          </div>
          <Input
            label="Or paste image URL"
            placeholder="https://…"
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); setValue('image', e.target.value); }}
            style={{ marginTop: '12px' }}
          />
        </section>

        {/* Ingredients */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>
            Ingredients
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ingFields.map((field, index) => (
              <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                <Input
                  placeholder="Ingredient name"
                  error={errors.ingredients?.[index]?.name?.message}
                  {...register(`ingredients.${index}.name`, { required: 'Required' })}
                />
                <Input placeholder="Amount" {...register(`ingredients.${index}.amount`, { required: true })} />
                <Input placeholder="Unit (optional)" {...register(`ingredients.${index}.unit`)} />
                <button
                  type="button"
                  onClick={() => removeIng(index)}
                  disabled={ingFields.length === 1}
                  style={{
                    padding: '10px', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    color: '#dc2626', background: 'white',
                    opacity: ingFields.length === 1 ? 0.4 : 1,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button" variant="outline" size="sm"
            style={{ marginTop: '12px' }}
            onClick={() => addIng({ name: '', amount: '', unit: '' })}
          >
            <Plus size={14} /> Add Ingredient
          </Button>
        </section>

        {/* Instructions */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>
            Instructions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {instFields.map((field, index) => (
              <div key={field.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  flexShrink: 0, width: '32px', height: '32px', marginTop: '4px',
                  background: 'var(--rust)', color: 'white',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <Textarea
                    placeholder={`Step ${index + 1}…`}
                    rows={2}
                    error={errors.instructions?.[index]?.text?.message}
                    {...register(`instructions.${index}.text`, { required: 'Required' })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInst(index)}
                  disabled={instFields.length === 1}
                  style={{
                    padding: '10px', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    color: '#dc2626', background: 'white', marginTop: '4px',
                    opacity: instFields.length === 1 ? 0.4 : 1,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button" variant="outline" size="sm"
            style={{ marginTop: '12px' }}
            onClick={() => addInst({ text: '' })}
          >
            <Plus size={14} /> Add Step
          </Button>
        </section>

        {/* Tags & Dietary */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '20px' }}>
            Tags & Dietary
          </h2>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Tags (press Enter or comma to add)
            </label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px',
              padding: '8px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)', background: 'var(--white)', minHeight: '44px',
            }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 10px', background: 'var(--brown-100)',
                  borderRadius: '999px', fontSize: '12px', color: 'var(--brown-700)',
                }}>
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>
                    ×
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag…"
                style={{
                  border: 'none', outline: 'none', fontSize: '14px',
                  background: 'transparent', minWidth: '80px', flex: 1,
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
          </div>

          {/* Dietary */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Dietary Options
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DIETARY.map(d => (
                <span
                  key={d}
                  onClick={() => toggleDietary(d)}
                  style={{
                    padding: '6px 14px', borderRadius: '999px',
                    fontSize: '13px', cursor: 'pointer', fontWeight: 500,
                    transition: 'all var(--transition)',
                    background: selectedDietary.includes(d) ? 'var(--sage)' : 'var(--cream-dark)',
                    color: selectedDietary.includes(d) ? 'white' : 'var(--text-secondary)',
                    border: '1px solid transparent',
                    userSelect: 'none',
                  }}
                >
                  {d.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Nutrition (optional) */}
        <section style={{
          background: 'var(--white)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)', padding: '28px'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '6px' }}>
            Nutrition <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>Optional</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Per serving values</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
            <Input label="Calories" type="number" placeholder="kcal" {...register('nutrition.calories', { valueAsNumber: true })} />
            <Input label="Protein" placeholder="e.g. 20g" {...register('nutrition.protein')} />
            <Input label="Carbs" placeholder="e.g. 45g" {...register('nutrition.carbohydrates')} />
            <Input label="Fat" placeholder="e.g. 12g" {...register('nutrition.fat')} />
            <Input label="Fiber" placeholder="e.g. 4g" {...register('nutrition.fiber')} />
          </div>
        </section>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '40px' }}>
          <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={isLoading}>
            {defaultValues ? 'Update Recipe' : 'Publish Recipe'}
          </Button>
        </div>
      </div>
    </form>
  );
}