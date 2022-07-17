// import SectionTitle from '../SectionTitle';
import s from './page-content.module.scss';
import { useEffect, useState } from 'react';

const PageContent = ({ title, content }) => {
  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  return (
    <div>
      {/* {windowWidth >= 770 ? <SectionTitle title="О нас" /> : null} */}
      <div className={s.content}>
        <h2 className={s.title}>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default PageContent;
