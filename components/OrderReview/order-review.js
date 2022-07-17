
import s from "./order-review.module.scss";

const OrderReview = ({ data, selectDelivery, level }) => {
  let deliveryPrice = ""

  if (selectDelivery === "flat_rate") {
    deliveryPrice = "Договорная"
  }
  if (level == 1) {
    deliveryPrice = "Договорная"
  }
  return (
    <>
      <div className={s.orderreview}>
        <h4 className={s.title}>Сумма к оплате</h4>
        <ul className={s.list}>
          <li className={`${s.item} ${s.subtotal}`}>
            Подытог <span>{data.price} UZS</span>
          </li>
          <li className={`${s.item} ${s.sale}`}>
            Ваша скидки <span>-{data.sale} UZS</span>
          </li>
          {selectDelivery === "flat_rate" ? (

              <li className={`${s.item} ${s.delivery}`}>
                Доставка <span>{deliveryPrice}</span>
              </li>
            
          ) : null}
          {data.delivery ? (
            <li className={`${s.item} ${s.delivery}`}>
              Доставка <span>{data.delivery} UZS</span>
            </li>
          ) : null}
          <li className={`${s.item} ${s.total}`}>
            Итого <span>{data.totalPrice} UZS</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default OrderReview;
