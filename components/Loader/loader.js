import s from './loader.module.scss';
import Image from 'next/image';

const Loader = ({ coupon }) => (
  <>
    <div className={`${s.wrapper} ${coupon ? s.coupon : ''}`}>
      <div className={s.loader}>
        <div className={s.border}></div>
        <div className={s.logo}>
          <Image src="/Xsportfavicon.ico" width={50} height={50} alt="logo_icon" />
        </div>
      </div>
      <div className={s.text}>Идет загрузка...</div>
    </div>
  </>
);

export default Loader;
