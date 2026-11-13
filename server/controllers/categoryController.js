import {
  getCategoriesService,
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService.js";

// GET /api/categories
export const listCategories = async (req, res) => {
  const categories = await getCategoriesService();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
};

// GET /api/categories/admin/all
export const listAllCategories = async (req, res) => {
  const categories = await getAllCategoriesService();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
};

// POST /api/categories
export const createCategory = async (req, res) => {
  const category = await createCategoryService(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  await deleteCategoryService(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deactivated successfully",
  });
};
