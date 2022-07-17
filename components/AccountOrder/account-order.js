import s from './account-order.module.scss';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useUser from '../../utils/useUser';
import axios from 'axios';
import Loader from '../../components/Loader';
import icons from '../../public/fixture';
const status = [
  {
    title: 'Принят',
    text: 'Ваш заказ принят! Наши менеджеры свяжутся с вами для уточнения всех деталей. ',
  },
  {
    title: 'Обработка',
    text: 'Ваш заказ в обработке и скоро будет вам отправлен',
  },
  {
    title: 'Доставлен ',
    text: 'Товар доставлен по адресу',
  },
];

const AccountOrder = ({ coupons }) => {
  const [active, setActive] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(async () => {
    const response = await axios.post('/api/user/orders');
    const formattedOrders = response.data.orders.map((order) => ({
      id: order.id,
      date: order.date,
      status: order.status,
      content: {
        date: order.date,
        products: order.lineItems.map((item) => ({
          name: item.product.name,
          image: item.product.image.sourceUrl,
          quantity: item.quantity,
          size: item.size[0].value,
          color: item.color[0].value,
          price: `${item.product.price} UZS`,
        })),
        total: `${order.total} UZS`,
        orderId: order.id,
        address: order.address,
        payment: order.payment,
      },
    }));

    setOrders(formattedOrders);
    setLoader(false);
  }, []);

  if (loader) {
    return <Loader />;
  }
  if (orders.length > 0) {
    return (
      <div className={s.orders} key={orders.length}>
        {orders.map(({ id, date, status, content }) =>
          coupons ? (
            <div className={s.order} key={id}>
              <ul className={s.list}>
                <li className={s.item}>
                  <div className={s.name}>Номер заказа</div>
                  <div className={s.value}>№ {content.orderId}</div>
                </li>
                <li className={s.item}>
                  <div className={s.name}>Сумма заказа</div>
                  <div className={s.value}>{content.total}</div>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <div className={`${s.orderDate}`} key={id}>
                {date}
              </div>
              {id == active ? (
                <div className={s.activeOrder}>
                  <div className={s.heading}>
                    <div className={s.title}>Подробные данные заказа</div>
                    <button className={s.close} onClick={() => setActive(0)}>
                      Скрыть
                    </button>
                  </div>
                  <ul className={s.list}>
                    <li className={s.item}>
                      <div className={s.name}>Номер заказа</div>
                      <div className={s.value}>№ {content.orderId}</div>
                    </li>

                    <li className={s.item}>
                      <div className={s.name}>Метод оплаты</div>
                      <div className={s.value}>{content.payment}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Сумма заказа</div>
                      <div className={s.value}>{content.total}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Адрес доставки</div>
                      <div className={s.value}>{content.address}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Статус</div>
                      <div className={s.value}>{status}</div>
                    </li>
                  </ul>
                  <div className={s.heading}>
                    <div className={s.title}>Товары</div>
                  </div>
                  {content.products.map((product) => (
                    <div className={s.card} key={product.databaseId}>
                      <img src={product.image ? product.image : null} alt="" className={s.img} />
                      <div className={s.details}>
                        <div className={s.title}>
                          <div className={s.name}>{product.name}</div>

                          <div className={s.price}>
                            {product.onSale ? (
                              <>
                                <span className={s.salePrice}> {salePriceFront} </span>
                                <span className={s.normalPrice}>{product.price}</span>
                              </>
                            ) : (
                              <span> {product.price}</span>
                            )}
                          </div>
                        </div>
                        {/* <div className={s.brand}>
                        {product.paBrands.nodes[0].name
                          ? product.paBrands.nodes[0].name
                          : null}
                      </div> */}
                        <div className={s.color}>
                          Цвет
                          <span>{product.color}</span>
                        </div>
                        <div className={s.flex}>
                          <div className={s.size}>
                            Размер
                            <span>{product.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.order}>
                  <ul className={s.list}>
                    <li className={s.item}>
                      <div className={s.name}>Номер заказа</div>
                      <div className={s.value}>№ {content.orderId}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Адрес доставки</div>
                      <div className={s.value}>{content.address}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Сумма заказа</div>
                      <div className={s.value}>{content.total}</div>
                    </li>
                    <li className={s.item}>
                      <div className={s.name}>Статус</div>
                      <div className={s.value}>{status}</div>
                    </li>
                    <li className={s.item}>
                      <button onClick={() => setActive(id)}>Подробно</button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ),
        )}
      </div>
    );
  } else {
    return (
      <div className={s.emptyCart}>
        <div className={s.i}>
          <i dangerouslySetInnerHTML={{ __html: icons.info }} />
          <p>
            Вы еще не соверашли <strong>Покупок</strong>
          </p>
        </div>
        <Link href="/">
          <a>Перейти к покупке</a>
        </Link>
      </div>
    );
  }
};
export default AccountOrder;
