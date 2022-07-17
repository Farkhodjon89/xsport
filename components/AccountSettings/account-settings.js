import React, { useEffect, useState } from 'react';
import s from './account-settings.module.scss';
import useUser from '../../utils/useUser';
import { useForm } from 'react-hook-form';
import MaskedInput from 'react-input-mask';
import axios from 'axios';

const AdminAbout = () => {
  const { register, handleSubmit, errors } = useForm();

  const { userData } = useUser();
  const [city, setCity] = useState();
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [country, setCountry] = useState();
  const [email, setEmail] = useState();
  const [surname, setSurname] = useState();
  const [phone, setPhone] = useState('+998 ');
  const [isLoading, setIsLoading] = useState(false);

  const sendInfo = async () => {
    const response = await axios.post('/api/user/edit', {
      firstName: name,
      lastName: surname,
      address: address,
      city: city,
      phone: phone,
    });
  };

  useEffect(() => {
    if (userData && userData.isLoggedIn) {
      setAddress(userData.user.billing.address1);
      setName(userData.user.firstName);
      setSurname(userData.user.lastName);
      setCity(userData.user.billing.city);
      setPhone(userData.user.billing.phone);
    }
  }, [userData]);

  return (
    <div className={s.settings}>
      <div className={s.title}>Персональные данные</div>
      <div className={s.flex}>
        <div className={s.inputs}>
          <input
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            ref={register({ required: true })}
            className={`${errors.name && s.error} ${name ? s.valid : ''}`}
            value={name}
          />
          <label htmlFor="name">Имя</label>
          {errors.name ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
        </div>
        <div className={s.inputs}>
          <input
            id="surname"
            name="surname"
            onChange={(e) => setSurname(e.target.value)}
            ref={register({ required: true })}
            className={`${errors.lastName && s.error} ${surname ? s.valid : ''}`}
            value={surname}
          />
          <label htmlFor="surname">Фамилия</label>
          {errors.surname ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
        </div>
      </div>
      <div className={s.flex}>
        <div className={s.inputs}>
          <MaskedInput
            mask="+\9\98 (99) 999 99 99"
            alwaysShowMask
            className={errors.phone && s.error}
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            name="phone">
            {(inputProps) => (
              <input
                ref={register({
                  required: true,
                  pattern:
                    /^[\+]?[0-9]{3}?[-\s\.]?[(]?[0-9]{2}?[)][-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{2}?[-\s\.]?[0-9]{2}$/im,
                })}
                value={phone}
                name={inputProps.name}
                {...inputProps}
              />
            )}
          </MaskedInput>
          {errors.phone ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
        </div>
        {/*<div className={s.inputs}>*/}
        {/*  <input*/}
        {/*    id="mail"*/}
        {/*    name="mail"*/}
        {/*    onChange={(e) => setEmail(e.target.value)}*/}
        {/*    ref={register({ required: false })}*/}
        {/*    className={`${errors.name && s.errorInput} ${email ? s.valid : ""}`}*/}
        {/*    value={email}*/}
        {/*  />*/}
        {/*  <label htmlFor="mail">E-mail Необязательное</label>*/}
        {/*</div>*/}
      </div>
      <div className={s.title}>Данные для доставки</div>
      <div className={s.flex}>
        {/*<div className={s.inputs}>*/}
        {/*  <input*/}
        {/*    id="country"*/}
        {/*    name="country"*/}
        {/*    onChange={(e) => setCountry(e.target.value)}*/}
        {/*    ref={register({ required: true })}*/}
        {/*    className={`${errors.country && s.error} ${country ? s.valid : ""}`}*/}
        {/*    value={country}*/}
        {/*  />*/}
        {/*  <label htmlFor="country">Страна</label>*/}

        {/*  {errors.country ? (*/}
        {/*    <p className={s.errorMessage}>Необходимо заполнить</p>*/}
        {/*  ) : null}*/}
        {/*</div>*/}
        <div className={s.inputs}>
          <input
            name="city"
            id="city"
            onChange={(e) => setCity(e.target.value)}
            ref={register({ required: true })}
            className={`${errors.city && s.error} ${city ? s.valid : ''}`}
            value={city}
          />
          <label htmlFor="city">Город</label>
          {errors.city ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
        </div>
      </div>

      <div className={s.inputs}>
        <input
          id="address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          ref={register({ required: true })}
          className={`${errors.address && s.error} ${address ? s.valid : ''}`}
          value={address}
        />
        <label htmlFor="address">Адрес (Район, улица, номер дома и квартиры)</label>
        {errors.address ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
      </div>
      <button onClick={handleSubmit(sendInfo)} disabled={isLoading} className={s.submitButton}>
        {isLoading ? <div className={s.loaderAnimation}></div> : <>Сохранить</>}
      </button>
    </div>
  );
};

export default AdminAbout;
