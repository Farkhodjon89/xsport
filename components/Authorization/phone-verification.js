import s from './authorization.module.scss';
import { useState } from 'react';
import axios from 'axios';
import useUser from '../../utils/useUser';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PhoneVerification = ({ setContent, contentTypes, phone, contentBefore }) => {
  const [otp, setOtp] = useState('');
  const { mutateUser } = useUser();
  const router = useRouter();

  const onSubmit = async () => {
    const response = await axios.post('/api/auth/login', {
      phone,
      otp,
      referalCode,
    });

    if (response.status) {
      mutateUser(response.data.userData).then(() => router.replace('/account'));
    }
  };

  return (
    <>
      <div className={s.modalTop2}>
        <div
          onClick={() =>
            setContent(
              contentBefore === contentTypes.signUp ? contentTypes.signIn : contentTypes.signUp,
            )
          }>
          <Image src="/arrowBack.svg" alt="arrowBack_icon" width={10} height={10} />
          Назад
        </div>
        <div>SMS ВЕРИФИКАЦИЯ</div>
      </div>
      <div className={s.modalCenterBlock}>
        <div className={s.modalText}>
          Пожалуйста, введите 6 значный код, который вы получили через SMS
        </div>
        <input placeholder="_ _ _    _ _ _" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <div className={s.modalText}>Не получили сообщение? Отправить снова</div>
      </div>
      <div className={s.modalBottom}>
        <button className={s.modalButtonWhite} onClick={onSubmit}>
          Подтвердить
        </button>

        <div className={s.modalWarning}>
          Создавая аккаунт вы соглашаетесь с Публичной офертой и Политикой конфиденциальности
          Bjeans.
        </div>
      </div>
    </>
  );
};

export default PhoneVerification;
