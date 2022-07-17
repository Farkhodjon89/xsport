import  { useEffect } from 'react';
import s from './admin-orders.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import useUser from '../../utils/useUser';
import axios from 'axios';
import Image from 'next/image';

const status = [
  {
    title: 'ПРИНЯТ',
    text: 'Ваш заказ принят! Наши менеджеры свяжутся с вами для уточнения всех деталей. ',
  },
  {
    title: 'ОБРАБОТКА',
    text: 'Ваш заказ в обработке и скоро будет вам отправлен',
  },
  {
    title: 'ДОСТАВЛЕНО ',
    text: 'Товар доставлен по адресу',
  },
];

const AdminAbout = () => {
  const [active, setActive] = useState(1);
  const [orders, setOrders] = useState([]);
  const { userData } = useUser();

  useEffect(async () => {
    const response = await axios.post('/api/user/orders');

    const formattedOrders = response.data.orders.map((order) => ({
      id: order.id,
      date: order.date,
      status: order.status,
      content: {
        date: order.date,
        products: order.lineItems.map((item) =>
          item.product ? item.product.image.sourceUrl : '/tempImg.jpg',
        ),
        total: `${order.total} som`,
        orderId: order.id,
        recipientName: 'RJ',
        phone: '998998767363',
        address: 'Uzbekistan',
        payment: 'cash',
      },
    }));

    if (formattedOrders.length) {
      setActive(formattedOrders[0].id);
    }

    setOrders(formattedOrders);
  }, []);

  return (
    <div className={s.wrapper}>
      <div className={s.left} key={orders.length}>
        <div className={s.forDELIVERY}>
          <div>ИСТОРИЯ ЗАКАЗОВ</div>
          <Link href="tel:+998712337117">
            <a>Нужна помощь? +998 71 2337117</a>
          </Link>
        </div>
        {orders.map(({ id, date, status }) => (
          <div
            className={`${s.order} ${active === id ? s.active : ''}`}
            key={id}
            onClick={() => setActive(id)}>
            {date}
            <span>{status}</span>
          </div>
        ))}
      </div>
      {orders.map(
        ({ id, content }) =>
          active === id && (
            <div key={id} className={s.right}>
              <div className={s.rightData}>{content.date}</div>
              <div className={s.rightProducts}>
                {content.products.map((r, i) => (
                  <Image src={r} key={i} alt="admin_order_image" width={160} height={238} />
                ))}
              </div>
              <div className={s.rightDetailsList}>
                <div className={s.rightDetails}>
                  Total:
                  <div>{content.total}</div>
                </div>
                <div className={s.rightDetails}>
                  Номер заказа:
                  <div>{content.orderId}</div>
                </div>
                <div className={s.rightDetails}>
                  Имя получателя:
                  <div>{content.recipientName}</div>
                </div>
                <div className={s.rightDetails}>
                  Контакты:
                  <div>{content.phone}</div>
                </div>
                <div className={s.rightDetails}>
                  Адрес:
                  <div>{content.address}</div>
                </div>
                <div className={s.rightDetails}>
                  Метод оплаты:
                  <div>{content.paymentType}</div>
                </div>
              </div>
              <div className={s.rightStatus}>
                {status.map((r, i) => (
                  <div key={i} className={i === 0 ? s.active : ''}>
                    {r.title} <span>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
};
export default AdminAbout;
