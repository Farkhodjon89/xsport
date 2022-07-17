import s from './banner.module.scss';
// import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Banner = ({ banners: { mobimage, image, title, subtitle, button, url, blog } }) => {
  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);
  return (
    <section>
      <div className={`${s.banner} ${blog ? s.blog : ''}`}>
        <div
          className={s.image}
          style={{
            background: `url(${
              windowWidth <= 771 ? mobimage.sourceUrl : image.sourceUrl
            }) no-repeat`,
            backgroundSize: 'cover',
          }}>
          <div className={s.content}>
            <div className={s.title}>{title}</div>
            <div className={s.subtitle} dangerouslySetInnerHTML={{ __html: subtitle }} />
            {button ? (
              <Link href={url}>
                <a className={s.button}>{button}</a>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <div className={`${s.mobileBanner} ${blog ? s.blog : ''}`}>
        <div
          className={s.image}
          style={{
            backgroundImage: `url(${windowWidth <= 771 ? mobimage.sourceUrl : image.sourceUrl})`,
          }}></div>
        <div className={s.content}>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle} dangerouslySetInnerHTML={{ __html: subtitle }} />
          {button ? (
            <Link href={url}>
              <a className={s.button}>{button}</a>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};
export default Banner;
