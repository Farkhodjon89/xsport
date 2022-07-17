import s from './application-main.module.scss';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { getPrice } from '../../utils';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import { deleteAllFromCart } from '../../redux/actions/cartActions';
import icons from '../../public/fixture';
// import ReactTooltip from 'react-tooltip'
// import MaskedInput from 'react-input-mask'
import OrderReview from '../OrderReview';
import SectionTitle from '../../components/SectionTitle';
import useUser from '../../utils/useUser';
import sha512 from 'js-sha512';
import PhoneInput from 'react-phone-input-2';
import validator from 'validator';

const delivery = [
  { text: `Доставка курьером`, value: 'flat_rate' },
  {
    text: `Самовывоз из магазина <br />`,
    value: 'local_pickup',
  },
];

const paymentMethods = [
  { img: '', value: 'cash', first: true },
  { img: '', value: 'card' },
  {
    img: <span dangerouslySetInnerHTML={{ __html: icons.payme }} />,
    value: 'payme',
  },
  {
    img: <span dangerouslySetInnerHTML={{ __html: icons.click }} />,
    value: 'click',
  },
  // {
  //   img: <span dangerouslySetInnerHTML={{ __html: icons.visa }} />,
  //   value: "octo",
  // },
];

const ApplicationMain = ({ cartItems, deleteAllFromCart }) => {
  const [order, setOrder] = useState();
  const { userData } = useUser();
  const [userLevel, setUserLevel] = useState();
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [comment, setComment] = useState('');

  const [selectMethod, setSelectMethod] = useState(paymentMethods[0].value);
  const [selectDelivery, setSelectDelivery] = useState(delivery[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const lineItems = [];

  for (const product of cartItems) {
    const { normalPrice, salePrice } = getPrice(product);
    lineItems.push({
      product_id: product.databaseId,
      name: product.name,
      price: product.onSale ? salePrice : normalPrice,
      quantity: product.quantity,
      variation_id: product.variations && product.selectedProductId,
    });
  }

  useEffect(() => {
    if (userData?.isLoggedIn) {
      setName(userData.user.firstName);
      setSurname(userData.user.lastName);
      setCity(userData.user.billing.city);
      setPhone(userData.user.billing.phone);
      setAddress(userData.user.billing.address1);
      setUserLevel(userData.user.level);
    }
  }, [userData]);

  const host =
    process.env.NODE_ENV === 'production' ? 'https://xsport2010.uz' : 'http://localhost:1122';

  const sendInfo = async () => {
    setIsLoading(true);
    const orderData = {
      customer_id: userData?.isLoggedIn ? userData.user.databaseId : 0,
      set_paid: false,
      currency: 'UZS',
      status: selectMethod === 'cash' ? 'processing' : 'pending',
      payment_method: selectMethod,
      payment_method_title:
        selectMethod === 'cash'
          ? 'Оплата наличными'
          : selectMethod === 'card'
          ? 'Оплата картой'
          : selectMethod,
      line_items: lineItems,
      billing: {
        country: country,
        email: email ? email : 'test@gmail.com',
        address_1: address,
        city: city,
        first_name: name,
        last_name: surname,
        phone: phone,
      },
      shipping_lines: [
        {
          method_id: selectDelivery === 'flat_rate' ? 'flat_rate' : 'local_pickup',
          method_title:
            selectDelivery === 'flat_rate' ? 'Доставка курьером' : 'Самовывоз из магазина',
          total: selectDelivery === 'flat_rate' && '',
          // ? userLevel != 1
          //   ? '10500'
          //   : ''
          // : '',
        },
      ],
      customer_note: comment && comment,
    };
    console.log(JSON.stringify(orderData))
    const response = await axios.post('/api/order', { order: orderData });

    if (response.data.status) {
      setOrder(response.data.order);

      if (selectMethod === 'cash') {
        await router.replace(`/order/${response.data.order.order_key}`);
        localStorage.clear();
      } else if (selectMethod === 'card') {
        const octoBasket = lineItems.map((item) => {
          return {
            position_desc: item.name,
            count: item.quantity,
            price: item.price,
          };
        });
        if (selectDelivery === 'flat_rate' && userLevel != 1) {
          octoBasket.push({
            position_desc: 'Доставка',
            count: 1,
            price: 0,
          });
        }
        const responseOcto = await axios.post(`/api/octo`, {
          octoBasket,
          order: response.data.order,
          host,
        });
        if (responseOcto.status) {
          await router.replace(responseOcto.data.data.octo_pay_url);
          localStorage.clear();
        }
      } else if (selectMethod === 'zoodpay') {
        axios
          .post('/api/zoodpay', {
            data: {
              customer: {
                customer_email: response.data.order.billing.email,
                customer_phone: response.data.order.billing.phone,
                first_name: response.data.order.billing.first_name,
                customer_dob: '2000-01-01',
              },
              items: response.data.order.line_items.map(({ name, price, quantity }) => ({
                categories: [['test', 'test']],
                name: name,
                price: price,
                quantity: quantity,
              })),
              order: {
                amount: parseInt(response.data.order.total).toFixed(2),
                currency: 'UZS',
                market_code: 'UZ',
                merchant_reference_no: response.data.order.id.toString(),
                service_code: 'ZPI',
                lang: 'ru',
                signature: sha512(
                  `Thems@uZ|${response.data.order.id}|${response.data.order.total}|UZS|UZ|6p&],BAj`,
                ),
              },
              shipping: {
                address_line1: response.data.order.billing.address_1,
                country_code: 'UZB',
                name: response.data.order.billing.first_name,
                zipcode: '100000',
              },
            },
          })
          .then((res) => {
            if (res.data.status === 400) {
              // setError({
              //   message: res.data.message,
              //   details: res.data.details,
              // })
              setIsLoading(false);
            } else {
              axios.post('/api/transaction', {
                id: response.data.order.id,
                transaction_id: res.data.data.transaction_id,
              });
              window.location.assign(res.data.data.payment_url);
              localStorage.clear();
            }
          });
      } else {
        const form = document.querySelector(`#${selectMethod}-form`);
        if (form) {
          form.submit();
        }
        localStorage.clear();
      }
    }
  };

  const { register, handleSubmit, errors } = useForm();

  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  const [emailError, setEmailError] = useState();

  const validateEmail = (e) => {
    var email = e.target.value;
    setEmail(email);

    if (validator.isEmail(email)) {
      setEmailError();
    } else {
      setEmailError('Неверный Email');
    }
  };

  let orderReviewData = {
    price: 0,
    sale: 0,
    totalPrice: 0,
    button: (
      <button onClick={handleSubmit(sendInfo)} disabled={isLoading} className={s.orderButton}>
        {isLoading ? <div className={s.loaderAnimation}></div> : <>Оформить заказ</>}
      </button>
    ),
  };

  for (const product of cartItems) {
    const { normalPrice, salePrice } = getPrice(product);
    orderReviewData.price += parseInt(normalPrice) * product.quantity;
    let deliveryPrice = selectDelivery == 'flat_rate' ? 0 : 0;
    if (userLevel == 1) {
      deliveryPrice = 0;
    }

    orderReviewData.sale += product.onSale
      ? parseInt(normalPrice) - parseInt(salePrice) * product.quantity
      : 0;
    orderReviewData.totalPrice = orderReviewData.price - orderReviewData.sale + deliveryPrice;
  }

  return (
    <div className="container">
      <SectionTitle title="Оформление заказа" />
      <form id="payme-form" method="post" action="https://checkout.paycom.uz">
        <input type="hidden" name="merchant" value="61a0c585bede17c4c1b73d92" />
        <input type="hidden" name="amount" value={orderReviewData.totalPrice * 100} />
        <input type="hidden" name="account[order_id]" value={order && order.id} />

        <input type="hidden" name="lang" value="ru" />

        <input type="hidden" name="callback" value={`${host}/order/${order && order.order_key}`} />
      </form>
      <form id="click-form" method="get" action="https://my.click.uz/services/pay">
        <input type="hidden" name="merchant_id" value="14086" />
        <input type="hidden" name="transaction_param" value={order && order.id} />
        <input type="hidden" name="service_id" value="19584" />
        <input type="hidden" name="amount" value={orderReviewData.totalPrice} />
        <input
          type="hidden"
          name="return_url"
          value={`${host}/order/${order && order.order_key}`}
        />
      </form>
      <div className={`row`}>
        <div className={`${s.left} col-lg-8`}>
          <div className={s.order}>
            {cartItems.length >= 1 ? (
              <div className={s.inner}>
                <div className={s.label}>Персональные данные</div>
                <div className={s.flex}>
                  <div className={s.inputs}>
                    <input
                      id="name"
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      ref={register({ required: true })}
                      className={`${errors.name && s.error} ${name ? s.valid : ''}`}
                    />
                    <label htmlFor="name">Имя</label>
                    {errors.name ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
                  </div>
                  <div className={s.inputs}>
                    <input
                      id="surname"
                      name="surname"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      ref={register({ required: true })}
                      className={`${errors.surname && s.error} ${surname ? s.valid : ''}`}
                    />
                    <label htmlFor="surname">Фамилия</label>
                    {errors.surname ? <p className={s.errorMessage}>Необходимо заполнить</p> : null}
                  </div>
                </div>
                <div className={s.flex}>
                  <div className={s.inputs}>
                    <PhoneInput
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      country="uz"
                      placeholder="+998 (99) 999-99-99"
                      masks={{ uz: '(..) ...-..-..' }}
                      inputClass={errors.phone && s.errorInput}
                    />
                  </div>
                  <div className={s.inputs}>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) => validateEmail(e)}
                    />
                    <label htmlFor="email">
                      Email (опционально) <span style={{ color: 'red' }}>{emailError}</span>
                    </label>
                  </div>
                  {/*<div className={s.inputs}>*/}
                  {/*  <input*/}
                  {/*    id="mail"*/}
                  {/*    name="mail"*/}
                  {/*    onChange={(e) => setEmail(e.target.value)}*/}
                  {/*    ref={register({ required: false })}*/}
                  {/*    className={`${errors.name && s.errorInput} ${*/}
                  {/*      email ? s.valid : ""*/}
                  {/*    }`}*/}
                  {/*  />*/}
                  {/*  <label htmlFor="mail">E-mail Необязательное</label>*/}
                  {/*</div>*/}
                </div>
                <div className={s.label}>Данные для доставки</div>
                <div className={s.flex}>
                  {/*<div className={s.inputs}>*/}
                  {/*  <input*/}
                  {/*    id="country"*/}
                  {/*    name="country"*/}
                  {/*    value={country}*/}
                  {/*    onChange={(e) => setCountry(e.target.value)}*/}
                  {/*    ref={register({ required: true })}*/}
                  {/*    className={`${errors.country && s.error} ${*/}
                  {/*      country ? s.valid : ""*/}
                  {/*    }`}*/}
                  {/*  />*/}
                  {/*  <label htmlFor="country">Страна</label>*/}

                  {/*  {errors.country ? (*/}
                  {/*    <p className={s.errorMessage}>Необходимо заполнить</p>*/}
                  {/*  ) : null}*/}
                  {/*</div>*/}
                  <div className={s.inputs}>
                    <input
                      name="city"
                      value={city}
                      id="city"
                      onChange={(e) => setCity(e.target.value)}
                      ref={register({ required: true })}
                      className={`${errors.city && s.error} ${city ? s.valid : ''}`}
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

                <div className={s.inputs}>
                  <textarea
                    id="comment"
                    name="comment"
                    onChange={(e) => setComment(e.target.value)}
                    ref={register}
                    className={`${comment ? s.valid : ''}`}
                  />
                  <label htmlFor="comment">Комментарии</label>
                </div>
                <div className={s.label}>Способ доставки</div>
                <div className={s.payments}>
                  {delivery.map((r) => (
                    <button
                      key={uuidv4()}
                      className={`${selectDelivery === r.value ? s.active : ''}`}
                      onClick={() => setSelectDelivery(r.value)}>
                      <div className={s.checker}></div>
                      <span dangerouslySetInnerHTML={{ __html: r.text }} />
                    </button>
                  ))}
                </div>
                <div className={s.label}>Метод оплаты</div>
                {/* <div>
                  Zoodpay - покупка товара в рассрочку в 4 платежа. Максимальная
                  сумма - 500 000 сум.
                </div>
                {selectMethod === 'zoodpay' && !email && (
                  <div style={{ color: 'red' }}>
                    При выборе Zoodpay Email обязателен
                  </div>
                )}
                <br /> */}
                <div className={s.payments}>
                  {paymentMethods.map((r, i) => (
                    <button
                      key={uuidv4()}
                      className={`${selectMethod === r.value ? s.active : ''} ${
                        r.value === 'zoodpay' && orderReviewData.totalPrice >= 500000
                          ? s.zoodpay
                          : ''
                      } `}
                      onClick={() => setSelectMethod(r.value)}>
                      <div className={s.checker}></div>
                      {r.img ? r.img : null}
                      {r.value === 'cash' && <span>Оплата наличными</span>}
                      {r.value === 'card' && (
                        <span>
                          Оплата картой: <br /> Humo, Uzcard
                        </span>
                      )}
                      {r.value === 'zoodpay' && <span>ZOODPAY</span>}
                    </button>
                  ))}
                </div>
                {windowWidth >= 500 ? (
                  <div className={s.submit}>
                    <div className={s.toCart}>
                      <Link href="/cart">
                        <a>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: icons.fullArrowLeft,
                            }}
                          />
                          Вернуться к корзине
                        </a>
                      </Link>
                    </div>
                    <button
                      onClick={handleSubmit(sendInfo)}
                      disabled={isLoading || (selectMethod === 'zoodpay' && !email)}
                      className={s.submitButton}>
                      {isLoading ? (
                        <div className={s.loaderAnimation}></div>
                      ) : (
                        <>Перейти к оплате</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className={s.submit}>
                    <button
                      onClick={handleSubmit(sendInfo)}
                      disabled={isLoading || (selectMethod === 'zoodpay' && !email)}
                      className={s.submitButton}>
                      {isLoading ? (
                        <div className={s.loaderAnimation}></div>
                      ) : (
                        <>Перейти к оплате</>
                      )}
                    </button>
                    <div className={s.toCart}>
                      <Link href="/cart">
                        <a>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: icons.fullArrowLeft,
                            }}
                          />
                          Вернуться к корзине
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={s.emptyCart}>
                Корзина пуста
                <Link href="/catalog">
                  <a>Начать покупки</a>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className={`${s.right} col-lg-4`}>
          <div className={s.rightInner}>
            <OrderReview data={orderReviewData} selectDelivery={selectDelivery} level={userLevel} />
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteAllFromCart: () => {
      dispatch(deleteAllFromCart());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationMain);
