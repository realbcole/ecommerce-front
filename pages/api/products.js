import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export default async function handler(req, res) {
  // Connect to database
  await mongooseConnect();

  // Get arguments from query
  const { categories, limit, sort, search, searchPage, ...filters } = req.query;

  // Format sort argument
  const [sortField, sortOrder] = (sort || '_id-desc').split('-');

  // Create query
  const query = {};

  // If categories are provided
  if (categories) {
    let categoriesIds = categories;
    if (typeof categories === 'string') {
      categoriesIds = categories.split(',');
    }
    let categoriesObjects = await Category.find({ _id: categoriesIds });
    categoriesObjects = categoriesObjects.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        parent: category.parent,
        properties: category.properties,
      };
    });

    // Add category ids to query
    query['category._id'] = {
      $in: categoriesObjects.map((category) => category._id),
    };
  }

  // If search is provided
  if (search) {
    const matchingCategories = await Category.find({
      name: { $regex: search, $options: 'i' },
    });
    let allCategoryIds = matchingCategories.map((category) => category._id);
    for (const category of matchingCategories) {
      const childCategories = await findAllChildCategories(category._id);
      allCategoryIds = allCategoryIds.concat(childCategories);
    }

    // Add search to query
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'category._id': { $in: allCategoryIds } },
      { 'category.parent._id': { $in: allCategoryIds } },
    ];
  }

  // If filters are provided
  if (Object.keys(filters).length > 0 && sort) {
    // Add filters to query
    Object.keys(filters).forEach((filterName) => {
      query[`properties.${filterName}`] = filters[filterName];
    });
  }

  let products;

  // If limit is provided, return only the number of products specified
  if (limit) {
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
      limit: parseInt(limit),
    });
  }
  // Else, return all products that match query
  else {
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
    });
  }
  res.json(products);
}

// Find all child categories of a category
async function findAllChildCategories(categoryId) {
  const categories = await Category.find({ parent: categoryId });
  let childCategories = categories.map((category) => category._id);

  for (const category of categories) {
    const children = await findAllChildCategories(category._id);
    childCategories = childCategories.concat(children);
  }

  return childCategories;
}
