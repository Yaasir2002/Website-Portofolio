const Portfolio = require('../models/Portfolio');

// @desc Get all portfolio items (filtered, searched)
// @route GET /api/portfolios
const getPortfolios = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tools: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const portfolios = await Portfolio.find(query).sort({ order: 1, createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single portfolio item by ID
// @route GET /api/portfolios/:id
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Increment view counter
    portfolio.views = (portfolio.views || 0) + 1;
    await portfolio.save();

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new portfolio item (admin)
// @route POST /api/portfolios
const createPortfolio = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      thumbnail,
      mediaType,
      videoUrl,
      tools,
      demoLink,
      githubLink,
      date,
      tags,
      isFeatured,
      order,
    } = req.body;

    const portfolio = new Portfolio({
      title,
      description,
      category,
      thumbnail,
      mediaType: mediaType || 'image',
      videoUrl: videoUrl || '',
      tools: Array.isArray(tools) ? tools : tools ? tools.split(',').map((t) => t.trim()) : [],
      demoLink: demoLink || '',
      githubLink: githubLink || '',
      date: date || new Date().getFullYear().toString(),
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      isFeatured: isFeatured || false,
      order: order || 0,
    });

    const createdPortfolio = await portfolio.save();
    res.status(201).json(createdPortfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a portfolio item (admin)
// @route PUT /api/portfolios/:id
const updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    const {
      title,
      description,
      category,
      thumbnail,
      mediaType,
      videoUrl,
      tools,
      demoLink,
      githubLink,
      date,
      tags,
      isFeatured,
      order,
    } = req.body;

    portfolio.title = title || portfolio.title;
    portfolio.description = description || portfolio.description;
    portfolio.category = category || portfolio.category;
    portfolio.thumbnail = thumbnail || portfolio.thumbnail;
    portfolio.mediaType = mediaType !== undefined ? mediaType : portfolio.mediaType;
    portfolio.videoUrl = videoUrl !== undefined ? videoUrl : portfolio.videoUrl;
    portfolio.demoLink = demoLink !== undefined ? demoLink : portfolio.demoLink;
    portfolio.githubLink = githubLink !== undefined ? githubLink : portfolio.githubLink;
    portfolio.date = date || portfolio.date;
    portfolio.isFeatured = isFeatured !== undefined ? isFeatured : portfolio.isFeatured;
    portfolio.order = order !== undefined ? order : portfolio.order;

    if (tools !== undefined) {
      portfolio.tools = Array.isArray(tools) ? tools : tools.split(',').map((t) => t.trim());
    }

    if (tags !== undefined) {
      portfolio.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }

    const updatedPortfolio = await portfolio.save();
    res.json(updatedPortfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a portfolio item (admin)
// @route DELETE /api/portfolios/:id
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await Portfolio.deleteOne({ _id: req.params.id });
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reorder portfolio items (admin)
// @route PUT /api/portfolios/reorder
const reorderPortfolios = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }

    const promises = items.map((item) =>
      Portfolio.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(promises);
    res.json({ message: 'Portfolios reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  reorderPortfolios,
};
