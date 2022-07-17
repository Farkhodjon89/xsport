import s from "./account-nav.module.scss";
import Link from "next/link";

const AccountNav = () => {
  return (
    <div className={s.navigation}>
      <ul className={s.list}>
        <li className={s.item}>
          <Link href="/account/orders">
            <a className={s.link}>Мои заказы</a>
          </Link>
        </li>
        <li className={s.item}>
          <Link href="/account/wishlist">
            <a className={s.link}>Мои избранные</a>
          </Link>
        </li>
        <li className={s.item}>
          <Link href="/account/settings">
            <a className={s.link}>Мои данные</a>
          </Link>
        </li>
        <li className={s.item}>
          <Link href="/account/coupons">
            <a className={s.link}>Купоны</a>
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default AccountNav;
