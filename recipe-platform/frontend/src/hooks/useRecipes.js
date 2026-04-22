import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { recipeAPI, userAPI, uploadAPI } from '../services/api'; // ✅ FIXED PATH
import toast from "react-hot-toast";

/* ================= RECIPES ================= */

// Get all recipes
export const useRecipes = (params) =>
  useQuery({
    queryKey: ["recipes", params],
    queryFn: () => recipeAPI.getAll(params).then((r) => r.data),
    staleTime: 30_000,
    keepPreviousData: true,
  });

// Get single recipe
export const useRecipe = (slug) =>
  useQuery({
    queryKey: ["recipe", slug],
    queryFn: () => recipeAPI.getOne(slug).then((r) => r.data),
    enabled: !!slug,
    staleTime: 60_000,
  });

// Featured recipes
export const useFeaturedRecipes = () =>
  useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: () => recipeAPI.getFeatured().then((r) => r.data),
    staleTime: 5 * 60_000,
  });

// My recipes
export const useMyRecipes = (params) =>
  useQuery({
    queryKey: ["recipes", "my", params],
    queryFn: () => recipeAPI.getMy(params).then((r) => r.data),
    staleTime: 30_000,
  });

// Similar recipes
export const useSimilarRecipes = (id) =>
  useQuery({
    queryKey: ["recipes", "similar", id],
    queryFn: () => recipeAPI.getSimilar(id).then((r) => r.data),
    enabled: !!id,
  });

// Tags
export const usePopularTags = () =>
  useQuery({
    queryKey: ["tags"],
    queryFn: () => recipeAPI.getTags().then((r) => r.data),
    staleTime: 10 * 60_000,
  });

/* ================= MUTATIONS ================= */

// Create recipe
export const useCreateRecipe = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => recipeAPI.create(data).then((r) => r.data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipe published!");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create recipe"),
  });
};

// Update recipe
export const useUpdateRecipe = (id) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      recipeAPI.update(id, data).then((r) => r.data),

    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["recipes"] });

      if (data?.data?.slug) {
        qc.invalidateQueries({
          queryKey: ["recipe", data.data.slug],
        });
      }

      toast.success("Recipe updated!");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update recipe"),
  });
};

// Delete recipe
export const useDeleteRecipe = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => recipeAPI.delete(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipe deleted");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete recipe"),
  });
};

// Add review
export const useAddReview = (recipeId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      recipeAPI.addReview(recipeId, data).then((r) => r.data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["recipe", recipeId], // ✅ FIXED
      });

      toast.success("Review submitted!");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to submit review"),
  });
};

// Save / Unsave
export const useToggleSave = (recipeId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      recipeAPI.toggleSave(recipeId).then((r) => r.data),

    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: ["recipe", recipeId], // ✅ FIXED
      });

      qc.invalidateQueries({ queryKey: ["saved"] });

      toast.success(data.message);
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Action failed"),
  });
};

/* ================= USER ================= */

// User profile
export const useUserProfile = (username) =>
  useQuery({
    queryKey: ["user", username],
    queryFn: () => userAPI.getProfile(username).then((r) => r.data),
    enabled: !!username,
  });

// Saved recipes
export const useSavedRecipes = () =>
  useQuery({
    queryKey: ["saved"],
    queryFn: () => userAPI.getSaved().then((r) => r.data),
  });

// Follow / unfollow
export const useToggleFollow = (username) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      userAPI.toggleFollow(id).then((r) => r.data),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["user", username],
      });

      toast.success("Done!");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Action failed"),
  });
};

/* ================= UPLOAD ================= */

export const useUploadImage = () =>
  useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append("image", file);

      return uploadAPI.upload(fd).then((r) => r.data);
    },

    onSuccess: () => {
      toast.success("Image uploaded!");
    },

    onError: (err) =>
      toast.error(err.response?.data?.message || "Upload failed"),
  });