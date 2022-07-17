import s from './admin-favorites.module.scss';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import Image from 'next/image';
import { addToWishlist, deleteFromWishlist } from '../../redux/actions/wishlistActions';
import { getPrice, getFormat } from '../../utils';

const CartMain = ({ wishlistItems, deleteFromWishlist }) => {
  return wishlistItems.length >= 1 ? (
    <div className={s.wrapper}>
      <div className={s.mainTitle}>ИЗБРАННЫЕ ТОВАРЫ</div>
      <div className={s.cardlist}>
        {wishlistItems.map((product) => {
          const { normalPrice, salePrice } = getPrice(product);
          const normalPriceFront = getFormat(normalPrice) + ' som';
          const salePriceFront = getFormat(salePrice) + ' som';
          const sizes = product.variations
            ? product.variations.nodes.map(({ size }) => ({
                size: size.nodes[0]?.value,
              }))
            : [
                {
                  size: product.paSizes.nodes[0]?.name,
                },
              ];

          return (
            <div className={s.card} key={uuidv4()}>
              <Image
                src={product.image.sourceUrl}
                alt="admin_favorites_image"
                width={160}
                height={238}
              />
              {/* <img
                src='/removeMobile.svg'
                alt=''
                className={s.removeImg}
                onClick={() => deleteFromWishlist(product)}
              /> */}
              <div className={s.details}>
                <div className={s.nameRemove}>
                  <div>{product.name}</div>
                  <button onClick={() => deleteFromWishlist(product)}>
                    Удалить <Image src="/remove.svg" alt="remove_icon" width={10} height={10} />
                  </button>
                </div>
                <div className={s.price}>{product.onSale ? salePriceFront : normalPriceFront}</div>
                <div className={s.cardColorsList}></div>
                <div className={s.color}>
                  Цвета:
                  {product.paColors.nodes.map(({ name, color }, i) => (
                    <div key={name}>
                      {name}
                      <span
                        key={i}
                        style={{
                          backgroundColor: color,
                        }}></span>
                    </div>
                  ))}
                </div>
                <div className={s.size}>
                  Размеры:
                  {sizes.map(({ size }, i) => (
                    <span key={i}>{size}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className={s.emptyCart}>
      Пусто
      <Link href="/">
        <a>Начать покупки</a>
      </Link>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    wishlistItems: state.wishlistData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToWishlist: (item) => {
      dispatch(addToWishlist(item));
    },
    deleteFromWishlist: (item) => {
      dispatch(deleteFromWishlist(item));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartMain);
