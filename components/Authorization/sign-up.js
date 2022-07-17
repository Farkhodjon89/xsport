import s from './authorization.module.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useUser from '../../utils/useUser';

const SignUp = ({ setContent, contentTypes, setModalOpen, phone, setPhone, referralCode = '' }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { mutateUser } = useUser();
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

  const onSubmit2 = async (e) => {
    e.preventDefault();

    const response = await axios.post('/api/auth/send-otp', {
      firstName,
      lastName,
      phone,
    });

    if (response.data.status) {
      setSendOtp(true);
    }
  };

  return (
    <>
      <div className={s.title}>Регистрация</div>

      <div className={s.authorization}>
        <div className={s.right}>
          <div className={s.subtitle}>Создать новый аккаунт</div>
          <div className={s.inputs}>
            <input
              id="firstName"
              onChange={(e) => setFirstName(e.target.value)}
              className={firstName ? s.valid : ''}
            />
            <label htmlFor="firstName">Имя</label>
          </div>
          <div className={s.inputs}>
            <input
              id="lastName"
              onChange={(e) => setLastName(e.target.value)}
              className={lastName ? s.valid : ''}
            />
            <label htmlFor="lastName">Фамилия</label>
          </div>
          {windowWidth <= 600 && (
            <>
              {' '}
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
            </>
          )}
          {sendOtp ? (
            <button className={s.button} onClick={(e) => checkOtp(e)}>
              Зарегистрироваться
            </button>
          ) : (
            <button className={s.button} onClick={(e) => onSubmit2(e)}>
              Получить код
            </button>
          )}
          {windowWidth <= 600 && (
            <button className={s.buttonWhite} onClick={() => setContent(contentTypes.signIn)}>
              У меня уже есть аккаунт
            </button>
          )}
        </div>
        {windowWidth >= 600 && (
          <div className={s.left}>
            <div className={s.space} />
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

            <button className={s.buttonWhite} onClick={() => setContent(contentTypes.signIn)}>
              У меня уже есть аккаунт
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
