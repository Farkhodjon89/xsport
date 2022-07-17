import s from './authorization.module.scss';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useUser from '../../utils/useUser';
import icons from '../../public/fixture';

const SignIn = ({ setContent, contentTypes, phone, setPhone, referralCode = '' }) => {
  const [sendOtp, setSendOtp] = useState(false);
  const [otp, setOtp] = useState(false);
  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  const { mutateUser } = useUser();
  const checkOtp = async () => {
    const response = await axios.post('/api/auth/login', {
      phone,
      otp,
      referralCode,
    });

    if (response.status) {
      mutateUser(response.data.userData);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/auth/send-otp', { phone });
    if (response.data.status) {
      setSendOtp(true);
    }
  };

  return (
    <>
      <div className={s.title}>Авторизация</div>
      <div className={s.authorization}>
        <div className={s.right}>
          <div className={s.subtitle}>Войти в кабинет</div>
          <div className={s.inputs}>
            <input
              id="phone"
              onChange={(e) => setPhone(e.target.value)}
              className={phone ? s.valid : ''}
            />
            <label htmlFor="phone">Номер телефона</label>
          </div>
          {sendOtp ? (
            <div className={s.inputs}>
              <input
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
                className={phone ? s.valid : ''}
              />
              <label htmlFor="otp">Код</label>
            </div>
          ) : null}

          {windowWidth <= 600 ? (
            <div className={s.twoButton}>
              {sendOtp ? (
                <button className={s.button} onClick={(e) => checkOtp(e)}>
                  Войти
                </button>
              ) : (
                <button className={s.button} onClick={(e) => onSubmit(e)}>
                  Получить код
                </button>
              )}
              <button className={s.buttonWhite} onClick={() => setContent(contentTypes.signUp)}>
                Зарегистрироваться
              </button>
            </div>
          ) : sendOtp ? (
            <button className={s.button} onClick={(e) => checkOtp(e)}>
              Войти
            </button>
          ) : (
            <button className={s.button} onClick={(e) => onSubmit(e)}>
              Получить код
            </button>
          )}
        </div>
        <div className={s.left}>
          <div className={s.subtitle}>Создать новый аккаунт</div>
          <div className={s.content}>
            <div className={s.text}>После регистрации у вас появится несколько преимуществ:</div>
            <div className={s.advantages}>
              <ul className={s.list}>
                <li className={s.item}>
                  <span dangerouslySetInnerHTML={{ __html: icons.tracking }} /> Трекинг заказов
                </li>
                <li className={s.item}>
                  <span dangerouslySetInnerHTML={{ __html: icons.wishlist }} /> Сохранять на потом
                </li>
                <li className={s.item}>
                  <span dangerouslySetInnerHTML={{ __html: icons.frame }} /> Возврат и обмен
                </li>
              </ul>
            </div>
            {windowWidth >= 600 && (
              <button className={s.buttonWhite} onClick={() => setContent(contentTypes.signUp)}>
                Зарегистрироваться
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
