import s from './product.module.scss';
import Link from 'next/link';
import { getPrice, getFormat } from '../../utils';
import { useState } from 'react';
import icons from '../../public/fixture.js';
import { connect } from 'react-redux';
import { addToWishlist, deleteFromWishlist } from '../../redux/actions/wishlistActions';
import Image from 'next/image';

const Product = ({ product, wishlistItems, addToWishlist, deleteFromWishlist, catalog, newProduct }) => {
  const [selectedSize, setSelectedSize] = useState();
  const changeSize = (size) => {
    setSelectedSize(size);
  };
  const { normalPrice, salePrice } = getPrice(product);
  const normalPriceFront = [getFormat(normalPrice), 'UZS'].join(' ');
  const salePriceFront = [getFormat(salePrice), 'UZS'].join(' ');
  const wishlistItem = wishlistItems.filter((wishlistItem) => wishlistItem.id === product.id)[0];

  return (
    <div className={`${s.product} ${catalog ? `col-lg-4 col-6 ${s.catalog}` : ''}`}>
      <div className={s.top}>
        {product.image ? (
          <Link href={'/product/' + product.slug} key={product.id}>
            <a>
              <span className={newProduct ? s.newProduct : ''}>{newProduct && 'Новинка'}</span>
              <Image
                src={product.image.sourceUrl}
                className={s.image}
                width={255}
                height={380}
                alt="product_image"
              />
              {/* <div className={s.label}>
                {product.onSale ? (
                  <span className={s.sale}>-{discountPrice}%</span>
                ) : null}
              </div> */}
            </a>
          </Link>
        ) : null}
      </div>

      <div className={s.bottom}>
        <Link href={'/product/' + product.slug}>
          <a>
            <div className={s.title}>
              <div className={s.name}>{product.name}</div>
              <div className={s.brand}>
                {product.paBrands.nodes.length != 0 ? product.paBrands.nodes[0].name : null}
              </div>
            </div>
          </a>
        </Link>
        <div className={s.prices}>
          {product.onSale ? (
            <>
              <div className={s.twoPrices}>
                <span className={s.normalPrice}> {normalPriceFront} </span>
                <span className={s.salePrice}>{salePriceFront}</span>
              </div>
            </>
          ) : (
            <span>{normalPriceFront}</span>
          )}

          <button
            className={`${s.addToWishlist} ${wishlistItem ? s.active : null}`}
            onClick={
              wishlistItem ? () => deleteFromWishlist(product) : () => addToWishlist(product)
            }
            dangerouslySetInnerHTML={{ __html: icons.wishlist }}
          />
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
