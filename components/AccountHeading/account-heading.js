import s from "./account-heading.module.scss";
import useUser from "../../utils/useUser";
import axios from "axios";
import { useRouter } from 'next/router'

const AccountHeading = ({firstName, level = 0}) => {
  const router = useRouter()
  const { userData } = useUser()

  const  logout = () => {
    axios.post("/api/auth/logout");
    router.push('/account')
  }
  return (
    <div className={s.heading}>
      <div className={s.name}>{firstName ? firstName : null}{level === 1 && <span className={s.plus}>+ Plus</span>}</div>
      <button className={s.logout} onClick={() => logout()}>Выйти</button>
    </div>
  );
};
export default AccountHeading;
