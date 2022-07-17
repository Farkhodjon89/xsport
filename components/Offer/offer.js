import s from "./offer.module.scss";
import icons from "../../public/fixture";

const Offer = () => (
  <section className={s.wrapper}>
    <div className={s.title}>Наши преимущества</div>
    <div className={s.content}> 
      <div>
        <span
          dangerouslySetInnerHTML={{ __html: icons.location }}
          className={s.icon}
        />
        <span>Быстрая доставка до дома</span>
      </div>
      <div>
        <span
          dangerouslySetInnerHTML={{ __html: icons.shieldDone }}
          className={s.icon}
        />
        <span>Оригинальная продукция</span>
      </div>
      <div>
        <span
          dangerouslySetInnerHTML={{ __html: icons.frame }}
          className={s.icon}
        />
        <span>Возврат и обмен</span>
      </div>
    </div>
  </section>
);
export default Offer;
