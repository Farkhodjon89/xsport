import icons from '../../public/fixture';
import s from './mobile-menu.module.scss';
import MobileCategories from '../MobileCategories';
import Link from 'next/link';
import MenuTabs from '../MenuTabs';
import { connect } from 'react-redux';

const MobileMenu = ({ activeStatus, getActiveStatus, categories, cartItems }) => {
  const men = categories.find((category) => category.slug === 'muzhchinam');
  const woman = categories.find((category) => category.slug === 'zhenshhinam');
  const children = categories.find((category) => category.slug === 'detyam');

  const mobileCategoryTabs = [
    {
      id: 0,
      name: 'Мужчины',
      icon: null,
      content: (
        <MobileCategories
          categories={men}
          parentCategory="muzhchinam"
          saleCategoryImage={
            men.category_settings?.mobilesaleimage
              ? men.category_settings.mobilesaleimage?.sourceUrl
              : null
          }
          getActiveStatus={getActiveStatus}
        />
      ),
    },
    {
      id: 1,
      name: 'Женщины',
      icon: null,
      content: (
        <MobileCategories
          categories={woman}
          parentCategory="zhenshhinam"
          saleCategoryImage={
            woman.category_settings?.mobilesaleimage
              ? woman.category_settings.mobilesaleimage?.sourceUrl
              : null
          }
          getActiveStatus={getActiveStatus}
        />
      ),
    },

    {
      id: 3,
      name: 'Дети',
      icon: null,
      content: (
        <MobileCategories
          categories={children}
          parentCategory="detyam"
          saleCategoryImage={
            children.category_settings?.mobilesaleimage
              ? children.category_settings.mobilesaleimage?.sourceUrl
              : null
          }
          getActiveStatus={getActiveStatus}
        />
      ),
    },
  ];
  return (
    <section className={`${s.wrapper}  ${activeStatus && s.active}`}>
      <div className={s.mobileMenu}>
        <div className={s.heading}>
          <div className={s.logoMobile}>
            <Link href="/">
              <a>
                <span dangerouslySetInnerHTML={{ __html: icons.logo }} />
              </a>
            </Link>
          </div>

          <button onClick={() => getActiveStatus(false)} className={s.close}>
            <span dangerouslySetInnerHTML={{ __html: icons.times }} /> Закрыть
          </button>
        </div>
        <MenuTabs data={mobileCategoryTabs} mobileCategory={true} />
        <div className={s.menuBottom}>
          <div className={s.phone}>
            Телефон для справок
            <Link href="tel:+998903207178">
              <a>+998 90 320 71 78</a>
            </Link>
          </div>
          <ul className={s.list}>
            <li className={`${s.item} ${s.user}`}>
              <Link href="/">
                <a className={s.headerUser}>
                  <span dangerouslySetInnerHTML={{ __html: icons.user }} />
                  <span className={s.title}>Войти</span>
                </a>
              </Link>
            </li>
            <li className={`${s.item} ${s.wishlist}`}>
              <Link href="/wishlist">
                <a className={s.headerWishlist}>
                  <span
                    className={s.icon}
                    dangerouslySetInnerHTML={{
                      __html: icons.wishlist,
                    }}
                  />
                  <span className={s.title}>Избранное</span>
                </a>
              </Link>
            </li>
            <li className={`${s.item} ${s.cart}`}>
              <Link href="/cart">
                <a className={s.headerCart}>
                  <span className={s.icon} dangerouslySetInnerHTML={{ __html: icons.cart }} />
                  <span className={s.title}>
                    Корзина {cartItems.length > 0 && `(${cartItems.length})`}
                  </span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
  };
};

export default connect(mapStateToProps)(MobileMenu);
