import s from './header.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileMenu from '../MobileMenu';
// import CartModal from "../CartModal";
import { connect } from 'react-redux';
import icons from '../../public/fixture';
// import { useRouter } from 'next/router'
import LinksModal from '../LinksModal';
import client from '../../apollo/apollo-client';
import { useLazyQuery } from '@apollo/react-hooks';
import PRODUCTS from '../../queries/products';

const Header = ({ cartItems, wishlistItems, categories }) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const header = document.querySelector('section');
    setHeaderTop(header.offsetTop);
    setHeaderHeight(header.offsetHeight);
    window.addEventListener('scroll', handleScroll);
    scroll > headerTop
      ? (document.body.style.paddingTop = `${headerHeight}px`)
      : (document.body.style.paddingTop = 0);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  console.log(categories)
  const categoryList = [];
  for (const category of categories) {
    categoryList.push(
      <li className={`${s.item} category_menu`} key={category.databaseId}>
        <Link href={`/catalog/${category.slug}`}>
          <a>{category.name}</a>
        </Link>
        <LinksModal categories={category.children.nodes} parentCategory={category.slug} />
      </li>,
    );
  }

  const [isSearchActive, setIsSearchActive] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadProducts, { data, loading }] = useLazyQuery(PRODUCTS, {
    client,
  });

  useEffect(() => {
    if (data && searchQuery.length) {
      setSearchResults(data.products.nodes);
    }
  }, [data]);

  const searchData = (e) => {
    setSearchResults([]);
    setSearchQuery(e.target.value);

    if (e.target.value.length) {
      loadProducts({
        variables: {
          first: 10,
          search: e.target.value,
        },
      });
    }
  };
  return (
    <>
      <header>
        <section className={`${scroll > headerTop ? s.sticky : ''} ${s.header}`}>
          <div className="container">
            <div className={s.content}>
              <div className="col-lg-4 col-4">
                <div className={s.left}>
                  <div className={`${s.burger}`}>
                    <span
                      className={s.icon}
                      onClick={() => setOpen(true)}
                      dangerouslySetInnerHTML={{ __html: icons.burger }}
                    />
                    <span className={s.title}>Меню</span>
                  </div>
                  <ul className={s.list}>{categoryList}</ul>
                </div>
              </div>
              <div className="col-lg-4 col-4">
                <div className={s.center}>
                  <div className={s.logo}>
                    <Link href="/">
                      <a>
                        <span dangerouslySetInnerHTML={{ __html: icons.logo }} />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-4">
                <div className={s.right}>
                  <ul className={s.list}>
                    <li className={`${s.item} ${s.cartMobile}`}>
                      <Link href="/cart">
                        <a className={s.headerCart}>
                          <span dangerouslySetInnerHTML={{ __html: icons.cart }} />
                          {/* <span className={s.title}>Корзина {cartItems.length > 0 && `(${cartItems.length})`}</span> */}
                        </a>
                      </Link>
                    </li>
                    <li className={s.search}>
                      <input
                        type="text"
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={searchData}
                        style={{ display: isSearchActive ? 'none' : 'block' }}
                      />
                      <span
                        className={s.icon}
                        dangerouslySetInnerHTML={{
                          __html: isSearchActive ? icons.search : icons.joki,
                        }}
                        onClick={() => {
                          setIsSearchActive((show) => !show);
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                      />
                      <div className={s.searchList}>
                        {loading && !searchResults.length ? (
                          <div>Загрузка...</div>
                        ) : searchQuery.length && !searchResults.length ? (
                          <div>Товары не найдены</div>
                        ) : searchResults.length ? (
                          <div>
                            {searchResults.map((product) => (
                              <Link href={'/product/' + product.slug} key={product.id}>
                                <a>{product.name}</a>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                    {/* <li className={`${s.item} ${s.user}`}>
                      <Link href='/account/orders'>
                        <a className={s.headerUser}>
                          <span
                            dangerouslySetInnerHTML={{ __html: icons.user }}
                          />
                        </a>
                      </Link>
                    </li> */}

                    <li className={`${s.item} ${s.wishlist}`}>
                      <Link href="/wishlist">
                        <a className={s.headerWishlist}>
                          <span
                            className={s.icon}
                            dangerouslySetInnerHTML={{
                              __html: icons.wishlist,
                            }}
                          />
                          {wishlistItems.length > 0 && (
                            <span className={s.title}>({wishlistItems.length})</span>
                          )}
                          {/* <span className={s.wishlistQuantity}>{wishlistItems.length}</span> */}
                        </a>
                      </Link>
                    </li>
                    <li className={`${s.item} ${s.cart}`}>
                      <Link href="/cart">
                        <a className={s.headerCart}>
                          <span
                            className={s.icon}
                            dangerouslySetInnerHTML={{ __html: icons.shopping_cart }}
                          />
                          <span className={s.title}>
                            {/*Корзина*/}
                            {/* {cartItems.length > 0 && `(${cartItems.length})`} */}(
                            {cartItems.length})
                          </span>
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <MobileMenu
          activeStatus={open}
          getActiveStatus={setOpen}
          categories={categories}
          wishlistItems={wishlistItems}
        />
      </header>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
  };
};

export default connect(mapStateToProps)(Header);
