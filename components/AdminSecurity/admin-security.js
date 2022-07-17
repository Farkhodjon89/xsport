import React from 'react'
import s from './admin-security.module.scss'
import useUser from "../../utils/useUser";

const AdminSecurity = () => {
  const { userData } = useUser();

  return (
    <div className={s.wrapper}>
      <div className={s.top}>
        <div>Important note! </div>
        <div>
          Please do not show verification codes from SMS messages to anyone
        </div>
      </div>
      <div className={s.title}>SECURITY & SETTINGS</div>
      <div className={s.phone}>
        Your phone number now: <span>{userData && userData.user ? ` +${userData.user.username}` : ''}</span>
      </div>
      <input placeholder='Write new one +998 •• ••• •• ••' />
      <input placeholder='Verification code:    _ _ _    _ _ _' />
      <div className={s.sendAgain}>
        Did not receive the code? <span> Send it again </span>
      </div>
      <button>GET VERIFICATION CODE</button>
    </div>
  )
}

export default AdminSecurity
