import s from './links-modal.module.scss'
import Link from 'next/link'
import { chunk } from '../../utils'

const LinksModal = ({ categories, parentCategory }) => {
  const categoryList = []
  // console.log(parentCategory);
  const allCategories = categories?.allCategories || categories || []
  for (const category of allCategories) {
    const subCategoryList = []
    for (const subCategory of category?.children?.nodes || []) {
      const subCategoryList2 = []
      if (subCategory?.children?.nodes.length != 0) {
        subCategoryList.push(
          <ul className={s.list}>
            <li className={s.item} key={subCategory.databaseId}>
              <Link href={`/catalog/${parentCategory}/${subCategory.slug}`}>
                <a>{subCategory.name}</a>
              </Link>
            </li>
            {subCategoryList2}
          </ul>
        )
        for (const subCategory2 of subCategory?.children?.nodes || []) {
          subCategoryList2.push(
            <>
              <li className={s.item}>
                <Link href={`/catalog/${parentCategory}/${subCategory2.slug}`}>
                  <a>{subCategory2.name}</a>
                </Link>
              </li>
            </>
          )
        }
      }
    }
    const subCategoryChunk = chunk(category?.children?.nodes, 6)

    for (const chunk2 of subCategoryChunk) {
      let test = []
      for (const subCategory of chunk2) {
        if (subCategory?.children?.nodes?.length == 0) {
          test.push(
            <>
              <li className={s.item}>
                <Link href={`/catalog/${parentCategory}/${subCategory.slug}`}>
                  <a>{subCategory.name}</a>
                </Link>
              </li>
            </>
          )
        }
      }
      subCategoryList.push(<ul className={s.list}>{test}</ul>)
    }

    categoryList.push(
      <ul className={s.list}>
        <li className={s.title}>
          <Link href={`/catalog/${parentCategory}/${category.slug}`}>
            <a>{category.name}</a>
          </Link>
          <div className={s.submenu}>
            <div className='container'>
              <div className={s.children}>{subCategoryList}</div>
            </div>
          </div>
        </li>
      </ul>
    )
  }
  categoryList.push(
    <ul className={s.list}>
      <li className={s.discount_text}>
        <Link href={`/catalog/${parentCategory}/sale`}>
          <a>{'Скидки'}</a>
        </Link>
      </li>
    </ul>
  )
  categoryList.push(
    <ul className={s.list}>
      <li className={s.discount_text}>
        <Link href={`/catalog/${parentCategory}/newProducts`}>
          <a>{'Новинки'}</a>
        </Link>
      </li>
    </ul>
  )

  return (
    <div className={`subcategory_menu ${s.menu}`}>
      <div className='container'>{categoryList}</div>
    </div>
  )
}

export default LinksModal
