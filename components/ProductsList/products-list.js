import s from './products-list.module.scss';
import Product from '../Product/product';

const ProductsList = ({ products, catalog }) => (
  <div className={s.list}>
    <div className="row">
      {products.map((product) => (
        <Product product={product} catalog={catalog} key={product.databaseId} />
      ))}
    </div>
  </div>
);

export default ProductsList;
