import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
  await mongooseConnect();
  const { categories, limit, sort, search, searchPage, ...filters } = req.query;
  const [sortField, sortOrder] = (sort || '_id-desc').split('-');

  const query = {};

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
    query['category._id'] = {
      $in: categoriesObjects.map((category) => category._id),
    };
  }
  if (search) {
    const matchingCategories = await Category.find({
      name: { $regex: search, $options: 'i' },
    });
    let allCategoryIds = matchingCategories.map((category) => category._id);
    for (const category of matchingCategories) {
      const childCategories = await findAllChildCategories(category._id);
      allCategoryIds = allCategoryIds.concat(childCategories);
    }
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'category._id': { $in: allCategoryIds } },
      { 'category.parent._id': { $in: allCategoryIds } },
    ];
  }

  if (Object.keys(filters).length > 0 && sort) {
    Object.keys(filters).forEach((filterName) => {
      query[`properties.${filterName}`] = filters[filterName];
    });
  }

  let products;
  if (limit) {
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
      limit: parseInt(limit),
    });
  } else {
    products = await Product.find(query, null, {
      sort: { [sortField]: sortOrder },
    });
  }
  res.json(products);
}

async function findAllChildCategories(categoryId) {
  const categories = await Category.find({ parent: categoryId });
  let childCategories = categories.map((category) => category._id);

  for (const category of categories) {
    const children = await findAllChildCategories(category._id);
    childCategories = childCategories.concat(children);
  }

  return childCategories;
}
