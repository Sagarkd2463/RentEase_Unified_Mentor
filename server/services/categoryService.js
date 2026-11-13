import Category from "../models/Category.js";
import { generateSlug, validateId, validateName } from "../utils/helper.js";

// Get active categories
export const getCategoriesService = async () => {
  return Category.find({ isActive: true }).sort({ name: 1 });
};

// Get all categories (admin)
export const getAllCategoriesService = async () => {
  return Category.find().sort({ createdAt: -1 });
};

// Create category
export const createCategoryService = async (data) => {
  const name = validateName(data.name);
  const slug = generateSlug(name);

  // Check duplicate name or slug
  const existing = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existing) {
    throw Error("Category name already exists");
  }

  const description = data.description ?? "";

  if (typeof description !== "string") {
    throw Error("Description must be a string");
  }

  return Category.create({
    name,
    slug,
    description: description.trim(),
  });
};

// Update category
export const updateCategoryService = async (id, data) => {
  validateId(id);

  const category = await Category.findById(id);

  if (!category) {
    throw Error("Category not found");
  }

  if (category.isActive === false) {
    throw Error("Inactive category cannot be updated");
  }

  // Update name and slug
  if (data.name !== undefined) {
    const name = validateName(data.name);
    const slug = generateSlug(name);

    const existing = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existing) {
      throw Error("Category name already exists");
    }

    category.name = name;
    category.slug = slug;
  }

  // Update description
  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      throw Error("Description must be a string");
    }

    category.description = data.description.trim();
  }

  // Update active status
  if (data.isActive !== undefined) {
    if (typeof data.isActive !== "boolean") {
      throw Error("isActive must be true or false");
    }

    category.isActive = data.isActive;
  }

  await category.save();

  return category;
};

// Deactivate category
export const deleteCategoryService = async (id) => {
  validateId(id);

  const category = await Category.findById(id);

  if (!category) {
    throw Error("Category not found");
  }

  if (!category.isActive) {
    throw Error("Category is already inactive");
  }

  category.isActive = false;

  await category.save();

  return category;
};
