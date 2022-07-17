import Link from "next/link";
import s from "./home-category-block.module.scss";

const HomeCategoryBlock = ({ categories }) => {
  
  const bannerList = []

  for (const category of categories) {
    bannerList.push(
      <div className={s.banner}>
        <div className={s.imageWrapper}>
          <div className={s.image} style={{background: `url(${category?.category_settings?.homeImage?.image?.sourceUrl})`}} />
        </div>
        <div className={s.button}>
          <a>{category.name}</a>
        </div>
        <Link href='/'>
          <a className={s.bannerLink} />
        </Link>
      </div>
    )
  }

  return (
     <div className={s.banners}>
        {bannerList}
     </div>
  )
};



export default HomeCategoryBlock
