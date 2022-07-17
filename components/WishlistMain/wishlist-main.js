import s from './wishlist-main.module.scss';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { deleteFromWishlist } from '../../redux/actions/wishlistActions';
import { getPrice, getFormat } from '../../utils';
import icons from '../../public/fixture';
import Breadcrumbs from '../Breadcrumbs';
import SectionTitle from '../SectionTitle';
import Image from 'next/image';

const WishlistMain = ({ wishlistItems, deleteFromWishlist }) => {
  const path = [
    {
      name: 'Главная',
      link: '/',
    },
    {
      name: 'Избранные товары',
      link: '/wishlist',
    },
  ];

  if (wishlistItems.length > 0) {
    return (
      <div className="container">
        <Breadcrumbs path={path} />
        <SectionTitle title="Избранные товары" />{' '}
        <div className={s.cardlist}>
          {wishlistItems.map((product) => {
            const { normalPrice, salePrice } = getPrice(product);
            const normalPriceFront = getFormat(normalPrice) + ' UZS';
            const salePriceFront = getFormat(salePrice) + ' UZS';
            // const discountPrice = getDiscount(normalPrice, salePrice);

            return (
              <div className={s.card} key={uuidv4()}>
                <Image
                  src={product.image ? product.image.sourceUrl : null}
                  alt="wishlist_item_img"
                  width={160}
                  height={238}
                />

                <div className={s.details}>
                  <div className={s.title}>
                    <div className={s.name}>{product.name}</div>

                    <div className={s.price}>
                      {product.onSale ? (
                        <>
                          <span className={s.salePrice}> {salePriceFront} </span>
                          <span
                            className={s.normalPrice}
                            style={{ textDecoration: 'line-through', color: '#787878' }}>
                            {normalPriceFront}
                          </span>
                        </>
                      ) : (
                        <span className={s.normalPrice}>{normalPriceFront}</span>
                      )}
                    </div>
                  </div>
                  <div className={s.brand}>
                    {product.paBrands.nodes[0]?.name ? product.paBrands.nodes[0].name : null}
                  </div>
                  <div className={s.color}>
                    Цвет
                    <span>{product.paColors.nodes[0]?.name}</span>
                  </div>

                  <div className={s.size}>
                    Размер
                    <span>{product.paSizes.nodes[0]?.name}</span>
                  </div>

                  <div className={s.cardBottom}>
                    <div className={s.remove}>
                      <div className={s.icon} dangerouslySetInnerHTML={{ __html: icons.remove }} />
                      <button onClick={() => deleteFromWishlist(product)}>Удалить</button>
                    </div>

                    <div className={s.addToCart}>
                      <Link href={`/product/${product.slug}`}>
                        <a className={s.productLink}>
                          <div
                            className={s.icon}
                            dangerouslySetInnerHTML={{ __html: icons.cart }}
                          />
                          Перейти к покупке
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className={s.container_empty}>
        <Breadcrumbs path={path} className={s.breadcrumbs} />
        <SectionTitle title="Избранные товары" />{' '}
        <div className={s.emptyCart}>
          <div className={s.i}>
            <p>У вас нет избранных товаров</p>
            <p>
              Перейдите в каталог, и выберите понравившийся товары и они появятся в этом разделе
            </p>
          </div>
          <div className={s.toOrder}>
            <Link href="/catalog">
              <a>Перейти в каталог</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromWishlist: (item) => {
      dispatch(deleteFromWishlist(item));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishlistMain);
