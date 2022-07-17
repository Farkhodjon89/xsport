import s from './main-slider.module.scss';
import Slider from 'react-slick';
import { v4 as uuidv4 } from 'uuid';
import icons from '../../public/fixture';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

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
  dots: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <SliderPrevArrow />,
  nextArrow: <SliderNextArrow />,
};

const MainSlider = ({ sliderData }) => {
  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  const slider = [];

  for (const v of sliderData) {
    slider.push(
      <div key={uuidv4()}>
        <div
          className={s.image}
          style={{
            backgroundImage: `url(${
              v.original
                ? v.original
                : v.image
                ? windowWidth <= 1023
                  ? v.mobileImage?.sourceUrl
                  : v.image.sourceUrl
                : null
            })`,
          }}>
          <div className={s.content}>
            <h2 className={s.title}>{v.title}</h2>
            <h2 className={s.subtitle}>{v.subtitle ? v.subtitle : null}</h2>
            <Link href={v.url}>
              <a className={s.button}>{v.buttonTitle ? v.buttonTitle : 'Перейти к покупке'}</a>
            </Link>
          </div>
        </div>
      </div>,
    );
  }

  return (
    <section className="main_slider">
      <Slider {...settings}>{slider}</Slider>
    </section>
  );
};
export default MainSlider;
