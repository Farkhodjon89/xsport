import client from '../apollo/apollo-client'
import CATEGORIES from '../queries/categories'

const fetchCategories = async () => {
  const response = await client.query({
    query: CATEGORIES,
    fetchPolicy: 'no-cache',
  })

  const list = []

  const allCat = response.data.productCategories.nodes.filter(
    (category) => category.slug !== 'misc' && category.slug !== 'uniseks'
  )
  console.log('allCat', allCat)
  const allCategories = [allCat[2], allCat[1], allCat[0]]

  for (const category of allCategories) {
    let subCategory2 = {}
    let subCategory = {}
    let parentCategory = {
      ...category,
      id: category.databaseId,
      parent: null,
      children: category.children
        ? category.children.nodes.map(({ slug }) => slug)
        : [],
    }
    if (category.children && category.children.nodes.length > 0) {
      for (const subcat1 of category.children.nodes) {
        subCategory = {
          slug: subcat1.slug,
          name: subcat1.name,
          id: subcat1.databaseId,
          parent: category.slug,
          children: subcat1.children
            ? subcat1.children.nodes.map(({ slug }) => slug)
            : [],
        }
        if (subcat1.children && subcat1.children.nodes.length > 0) {
          for (const subcat2 of subcat1.children.nodes) {
            subCategory2 = {
              slug: subcat2.slug,
              name: subcat2.name,
              id: subcat2.databaseId,
              parent: subcat1.slug,
              children: subcat2.children
                ? subcat1.children.nodes.map(({ slug }) => slug)
                : [],
            }
            list.push(subCategory2)
          }
        }
        list.push(subCategory)
      }
    }
    list.push(parentCategory)
  }

  const main = list.filter((category) => category.parent == null)

  return {
    list,
    main,
    allCategories,
  }
}

export class StaticData {
  constructor(categories) {
    this.categories = categories || {
      list: [],
      main: [],
      allCategories: [],
    }
  }
}

export class StaticDataSingleton {
  constructor() {
    if (!StaticDataSingleton.instance) {
      StaticDataSingleton.instance = new StaticData()
    }
  }

  getInstance() {
    return StaticDataSingleton.instance
  }

  async checkAndFetch(force = false) {
    const staticData = new StaticDataSingleton().getInstance()

    const isCategoriesEmpty = staticData.categories.list.length === 0

    if (force || isCategoriesEmpty) {
      try {
        staticData.categories = await fetchCategories()
      } catch (e) {
        staticData.categories = {
          list: [],
          main: [],
          allCategories: [],
        }
      }
    }
  }

  getRootCategories() {
    const staticData = new StaticDataSingleton()

    const menCategory = staticData.getCategoryBySlug('muzhchinam')

    const womenCategory = staticData.getCategoryBySlug('zhenshhinam', 1)
    const childrenCategory = staticData.getCategoryBySlug('detyam', 1)

    return {
      men: menCategory,
      women: womenCategory,
      children: childrenCategory,
      allCategories: staticData.getInstance().categories.allCategories,
    }
  }

  getCategoryBySlug(slug, childrenDeepLevel = 0) {
    const staticData = new StaticDataSingleton().getInstance()

    const category = staticData.categories.list.find((c) => c.slug === slug)

    const parentCategory = category?.parent
      ? staticData.categories.list.find((c) => c.slug === category.parent)
      : null

    if (childrenDeepLevel === 0) {
      return {
        ...category,
        parent: parentCategory,
        children: [],
      }
    } else {
      return {
        ...category,
        parent: parentCategory,
        children: category?.children?.map(
          (slug) =>
            new StaticDataSingleton().getCategoryChildren(
              slug,
              childrenDeepLevel - 1
            ) || null
        ),
      }
    }
  }

  getCategoryChildren(slug, level = 0) {
    const staticData = new StaticDataSingleton().getInstance()

    const category = staticData.categories.list.find((c) => c.slug === slug)

    if (level === 0 || category.children.length === 0) {
      return {
        ...category,
        children: [],
      }
    }

    return {
      ...category,
      children: category.children.map(({ slug }) =>
        new StaticDataSingleton().getCategoryChildren(slug, level - 1)
      ),
    }
  }

  // Result param is array, the method below will mutate this param
  getAllChildrenSlugs(slug, result) {
    const staticData = new StaticDataSingleton().getInstance()

    const slugs = staticData.categories.list
      .filter(({ parent }) => parent === slug)
      .map(({ slug }) => slug)

    if (!slugs.length) {
      return
    }

    result.push(...slugs)

    const childSlugs = slugs.map((slug) =>
      new StaticDataSingleton().getAllChildrenSlugs(slug, result)
    )

    if (!childSlugs.length || !childSlugs[0]) {
      return
    }

    result.push(...childSlugs)
  }
}
