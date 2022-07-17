import s from './category-filter.module.scss';
import Link from 'next/link';

const CategoryFilter = ({ categories, menu, category, parentCategory, getActiveStatus }) => {
  const categoryList = [];
  for (const category of categories) {
    categoryList.push(
      <Link href={`${category.link}`} key={category.databaseId}>
        <a onClick={() => getActiveStatus && getActiveStatus(false)}>{category.name}</a>
      </Link>,
    );
  }
  return (
    <div className={menu ? s.menuType : s.type}>
      {category && category.parent ? (
        <Link
          href={
            parentCategory.slug === category.parent.slug
              ? `/catalog/${parentCategory.slug}`
              : `/catalog/${parentCategory.slug}/${category.parent.slug}`
          }>
          <a onClick={() => getActiveStatus && getActiveStatus(false)}>
            Назад в {category.parent.name}
          </a>
        </Link>
      ) : null}
      {categoryList}
    </div>
  );
};
export default CategoryFilter;
