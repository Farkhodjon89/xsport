import s from "./header-two.module.scss";
import Link from "next/link";
import icons from "../../public/fixture";

const HeaderTwo = () => (
  <header className={s.header}>
    <div className="container">
      <div className={s.content}>
        <div className={s.row}>
          <div className={` ${s.logo}`}>
            <Link href="/">
              <a>
                <span
                  className={s.logo}
                  dangerouslySetInnerHTML={{ __html: icons.logo }}
                />
              </a>
            </Link>
          </div>
          <div className={` ${s.phone}`}>
            <Link href="/">
              <a>
                <span dangerouslySetInnerHTML={{ __html: icons.phone }} />
                +998 98 338-83-68
              </a>
            </Link>
          </div>
        </div>
       

        
      </div>
    </div>
  </header>
);

export default HeaderTwo;
