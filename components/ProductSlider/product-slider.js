import Product from '../Product';
import Slider from 'react-slick';
import icons from '../../public/fixture';
import s from './product-slider.module.scss';

const SliderPrevArrow = (props) => (
  <button
    className="sliderPrevArrow"
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowLeft }}
  />
);

const SliderNextArrow = (props) => (
  <button
    className="sliderNextArrow"
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowRight }}
  />
);

const settings = {
  infinite: true,

  slidesToShow: 3,
  slidesToScroll: 3,

  prevArrow: <SliderPrevArrow />,
  nextArrow: <SliderNextArrow />,
  responsive: [
    {
      breakpoint: 770,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false,
      },
    },
  ],
};

const ProductSlider = ({ products, title,  }) => {
  const productList = [];

  for (const product of products) {
    productList.push(<Product newProduct={title === 'Новинка'}  product={product} key={product.databaseId} />);
  }

  return (
    <section className="product_slider">
      <div className="row">
        <div className="col-lg-3 col-12">
          <div className={s.title}>{title}</div>
        </div>
        <div className="col-lg-9 col-12">
          <Slider {...settings}>{productList}</Slider>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
