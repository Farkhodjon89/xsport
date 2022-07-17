import s from './admin-main.module.scss';
import { useState } from 'react';

import AdminOrders from '../AdminOrders';
import AdminFavorites from '../AdminFavorites';
// import AdminSecurity from '../AdminSecurity';
// import useUser from '../../utils/useUser';
// import Authorization from '../Authorization';
import Image from 'next/image';

const tabItems = [
  {
    id: 1,
    title: 'Мои заказы',
    content: <AdminOrders />,
  },
  {
    id: 2,
    title: 'Мои избранные',
    content: <AdminFavorites />,
  },
  {
    id: 3,
    title: 'Мои данные',
    content: <AdminFavorites />,
  },
  {
    id: 4,
    title: 'Купоны',
    content: <AdminFavorites />,
  },
];

const AdminMain = () => {
  const [active, setActive] = useState(1);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3">
          <div className={s.tabsWrapper}>
            <div className={s.tabsInner}>
              {tabItems.map(({ id, title, img }) => (
                <div key={id} onClick={() => setActive(id)}>
                  <span className={active === id ? s.active : ''}>
                    <Image src={img} alt="admin_main_image" width={160} height={238} /> {title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          {tabItems.map(({ id, content }) => active === id && <div key={id}> {content} </div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
