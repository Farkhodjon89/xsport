import Link from 'next/link'
import { useState } from 'react'
import icons from '../../public/fixture'
import s from './mobile-categories.module.scss'

const MobileCategories = ({
  categories,
  parentCategory,
  saleCategoryImage,
  getActiveStatus,
}) => {
  const [activeCategory, setActiveCategory] = useState()
  const [activeChildrenCategory, setActiveChildrenCategory] = useState(false)
  let parentCategories = []

  for (const category of categories?.children?.nodes || []) {
    let childrenCategories = []
    let childrenCategories2 = []

    for (const children of category?.children?.nodes || []) {
      if (children.children.nodes.length != 0) {
        for (const children2 of children.children.nodes) {
          childrenCategories2.push(
            <li className={s.item} onClick={() => getActiveStatus(false)}>
              <Link href={`/catalog/${parentCategory}/${children2.slug}`}>
                <a onClick={() => setActiveChildrenCategory(true)}>
                  {children2.name}
                </a>
              </Link>
            </li>
          )
        }
      }
      childrenCategories.push(
        <>
          <li className={s.item} onClick={() => getActiveStatus(false)}>
            <Link href={`/catalog/${parentCategory}/${children.slug}`}>
              <a>{children.name}</a>
            </Link>
          </li>
          {childrenCategories2}
        </>
      )
    }

    parentCategories.push(
      <div className={s.categories}>
        <div
          className={s.category}
          onClick={() => setActiveCategory(category.slug)}
        >
          <span className={s.title}>{category.name}</span>
        </div>
        <div
          className={`${s.children} ${
            activeCategory == category.slug ? s.active : null
          }`}
        >
          <button className={s.back} onClick={() => setActiveCategory()}>
            <span dangerouslySetInnerHTML={{ __html: icons.fullArrowLeft }} />
            Назад
          </button>
          <div className={s.title}>{category.name}</div>
          <ul className={s.list}>{childrenCategories}</ul>
        </div>
      </div>
    )
  }
  return (
    <>
      {parentCategories}
      <div className={s.categories}>
        <Link href={`/catalog/${parentCategory}/sale`}>
          <a onClick={() => getActiveStatus(false)}>
            <div className={s.category}>
              <span className={s.discount_text}>Скидки</span>
            </div>
          </a>
        </Link>
      </div>
    </>
  )
}

export default MobileCategories
