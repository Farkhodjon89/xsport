import Link from 'next/link'
import s from './categoriesList.module.scss'
import Image from 'next/image'

const CategoriesList = ({ categories }) => {
  return (
    <ul className={s.wrapper}>
      {categories
        ?.filter((el) => el?.title)
        ?.map((cat) => (
          <li key={cat.title} className={s.content}>
            <Link href={cat.url}>
              <a className={s.link}>
                <Image
                  alt='subcategory_image'
                  src={cat.image.sourceUrl}
                  width={255}
                  height={380}
                />

                <span className={s.bottom}>{cat.title}</span>
              </a>
            </Link>
          </li>
        ))}
    </ul>
  )
}

export default CategoriesList
