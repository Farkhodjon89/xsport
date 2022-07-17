import s from './order-main.module.scss';
import Link from 'next/link';
// import icons from "../../public/fixture";
// import OrderReview from "../OrderReview";
import { humanReadableDate } from '../../utils';
import Image from 'next/image';

const OrderMain = ({ order }) => {
  let orderReviewData = {
    price: order.subtotal,
    sale: 0,
    delivery: order.shippingLines.nodes[0].total,
    totalPrice: order.total,
  };

  const productList = [];
  for (const data of order.lineItems.nodes) {
    const attributeList = [];
    if (data.variation) {
      for (const attribute of data.variation.attributes.nodes) {
        if (attribute.name == 'pa_color') {
          attributeList.push(
            <div className={s.color}>
              Цвет <span>{attribute.value}</span>
            </div>,
          );
        } else if (attribute.name == 'pa_size') {
          attributeList.push(
            <div className={s.size}>
              Размер <span>{attribute.value}</span>
            </div>,
          );
        }
      }
    }
    productList.push(
      <div className={s.product}>
        <div className={s.image}>
          <Image src={data.product.image.sourceUrl} width={65} height={96} alt="order_main_image" />
        </div>
        <div className={s.details}>
          <div className={s.title}>
            <div className={s.name}>{data.product.name}</div>
            <div className={s.price}>{data.total} UZS</div>
          </div>
          <div className={s.brand}>{data.product.paBrands.nodes[0].name}</div>
          <div className={s.attributes}>{attributeList}</div>
        </div>
      </div>,
    );
  }

  return (
    <>
      <section className={s.wrapper}>
        <h1 className={s.title}>Спасибо за покупку, {order.billing.firstName}!</h1>

        <div className={s.clientData}>
          <h2 className={s.title}>Данные заказчика</h2>
          <ul className={s.list}>
            <li className={s.item}>
              <p>Дата заказа</p> <span>{humanReadableDate(order.date)}</span>
            </li>
            <li className={s.item}>
              <p>Номер заказа</p> <span>№ {order.databaseId}</span>
            </li>
            <li className={s.item}>
              <p>Метод оплаты</p> <span>{order.paymentMethodTitle}</span>
            </li>
            <li className={s.item}>
              <p>Адрес доставки</p> <span>{order.billing.address1}</span>
            </li>
          </ul>
        </div>
        <div className={s.productList}>
          <h2 className={s.title}>Товары</h2>
          {productList}
        </div>
        {/* <OrderReview data={orderReviewData}/> */}
        <Link href="/">
          <a className={s.button}>Вернутся на главную страницу</a>
        </Link>
      </section>
    </>
  );
};

export default OrderMain;
