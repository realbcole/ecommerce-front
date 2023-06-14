import { NextApiHandler } from 'next';
import { mongooseConnect } from '../../lib/mongoose';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { CategoryType, ProductType } from '../../types';

const handler: NextApiHandler = async (req, res) => {
  // Connect to database
  await mongooseConnect();

  // Get arguments from query
  const { categories, limit, sort, search, searchPage, ...filters } = req.query;

  // Format sort argument
  let sortField = '_id';
  let sortOrder = 'desc';

  if (typeof sort === 'string') {
    [sortField, sortOrder] = sort.split('-');
  }

  // Create query
  const query: Record<string, unknown> = {};

  // If categories are provided
  if (categories) {
    let categoriesIds: string | string[] = categories;
    if (typeof categories === 'string') {
      categoriesIds = categories.split(',');
    }
    let categoriesObjects: CategoryType[] = await Category.find({
      _id: categoriesIds,
    });
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
    const matchingCategories: CategoryType[] = await Category.find({
      name: { $regex: search, $options: 'i' },
    });

    let allCategoryIds: string[] = matchingCategories.map(
      (category) => category._id
    );
    for (const category of matchingCategories) {
      const childCategories: string[] = await findAllChildCategories(
        category._id
      );
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
      if (filterName === 'category._id') {
        query['$or'] = [
          { 'category._id': filters[filterName] },
          { 'category.parent': filters[filterName] },
        ];
      } else query[`properties.${filterName}`] = filters[filterName];
    });
  }

  // Make sure products are not hidden
  query.hidden = false;

  let products: ProductType[];

  // If limit is provided, return only the number of products specified
  if (limit) {
    const limitNumber = typeof limit === 'string' ? parseInt(limit) : undefined;
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
      limit: limitNumber,
    });
  }
  // Else, return all products that match query
  else {
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
    });
  }
  res.json(products);
};

// Find all child categories of a category
async function findAllChildCategories(categoryId: string) {
  const categories: CategoryType[] = await Category.find({
    parent: categoryId,
  });
  let childCategories: string[] = categories.map((category) => category._id);

  for (const category of categories) {
    const children: string[] = await findAllChildCategories(category._id);
    childCategories = childCategories.concat(children);
  }

  return childCategories;
}

export default handler;
