const Category = require('../models/Category');

// Default initial categories specified in PRD
const DEFAULT_CATEGORIES = [
  { name: 'UI/UX Design', slug: 'ui-ux-design', order: 1 },
  { name: 'Web Development', slug: 'web-development', order: 2 },
  { name: 'Branding', slug: 'branding', order: 3 },
  { name: 'Mobile App', slug: 'mobile-app', order: 4 },
  { name: 'Graphic Design', slug: 'graphic-design', order: 5 },
  { name: 'Video / Motion Graphic', slug: 'video-motion-graphic', order: 6 },
];

// @desc Get all categories
// @route GET /api/categories
const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ order: 1, createdAt: 1 });
    if (categories.length === 0) {
      // Seed categories automatically if empty
      categories = await Category.insertMany(DEFAULT_CATEGORIES);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create category
// @route POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, order } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug,
      description: description || '',
      order: order || 0,
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update category
// @route PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, order } = req.body;

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
