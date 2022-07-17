import s from './contacts.module.scss';
import { useState } from 'react';

const Contacts = ({ contacts }) => {
  const [active, setActive] = useState(1);

  return (
    <>
      <div className={s.contacts}>
        <div className="row">
          <div className="col-lg-3  col-sm-12">
            <div className={s.left}>
              <ul className={s.list}>
                {contacts.map(({ id, address }) => (
                  <div
                    key={id}
                    onClick={() => setActive(id)}
                    className={`${s.item} ${active === id ? s.active : ''}`}>
                    {address}
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-9 col-sm-12">
            <div className={s.right}>
              {contacts.map(
                ({ id, address, landmark, workingHours, mapLink, address2 }) =>
                  active === id && (
                    <div key={id} className={s.item}>
                      <div className={s.address}>{address}</div>
                      <div className={s.address}>{address2}</div>
                      <div className={s.landmark}>{landmark}</div>
                      <div className={s.hours}>{workingHours}</div>
                      <div className={s.mapLink}>
                        <iframe src={mapLink} allowFullScreen loading="lazy" />
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contacts;
