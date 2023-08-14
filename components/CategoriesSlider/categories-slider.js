import s from './categories-slider.module.scss'
import Link from 'next/link'
import icons from '../../public/fixture'
import Slider from 'react-slick'

const SliderPrevArrow = (props) => (
  <button
    className='sliderPrevArrow'
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowLeft }}
  />
)

const SliderNextArrow = (props) => (
  <button
    className='sliderNextArrow'
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowRight }}
  />
)

const settings = {
  arrows: true,
  infinite: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  prevArrow: <SliderPrevArrow />,
  nextArrow: <SliderNextArrow />,
  responsive: [
    {
      breakpoint: 990,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
  ],
}

const CategoriesSlider = ({ categories, parentCategory }) => {
  const categoriesList = []

  // if (categories) {
  //   for (const category of categories) {
  //     categoriesList.push(
  //       category.image ? (
  //         <div className={s.category}>
  //           <Link href={`/catalog/${parentCategory}/${category.slug}`}>
  //             <a>
  //               <div
  //                 className={s.image}
  //                 style={{
  //                   backgroundImage: `url(${category.image.sourceUrl})`,
  //                 }}
  //               ></div>
  //               <div className={s.title}>{category.name}</div>
  //             </a>
  //           </Link>
  //         </div>
  //       ) : null
  //     )
  //   }
  // }
  return (
    <div className='categories_slider'>
      <div className={s.categories}>
        <Slider {...settings}>{categoriesList}</Slider>
      </div>
      <div className={s.mobileCategory}>{categoriesList}</div>
    </div>
  )
}

export default CategoriesSlider
