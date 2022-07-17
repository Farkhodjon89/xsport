import s from './footer.module.scss';
import Link from 'next/link';

import icons from '../../public/fixture';

const Footer = () => (
  <footer>
    <section className={s.footer}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className={s.menu}>
              <div className={s.make_center}>
                <div className="col-lg-4 col-6">
                  <ul className={s.list}>
                    <li className={s.title}>Категории</li>
                    <li className={s.item}>
                      <Link href="/catalog/muzhchinam">
                        <a>Мужчинам</a>
                      </Link>
                    </li>
                    <li className={s.item}>
                      <Link href="/catalog/zhenshhinam">
                        <a>Женщинам</a>
                      </Link>
                    </li>
                    <li className={s.item}>
                      <Link href="/catalog/detyam">
                        <a>Детям</a>
                      </Link>
                    </li>
                    {/* <li className={s.item}>
                      <Link href='/catalog/uniseks'>
                        <a>Унисекс</a>
                      </Link>
                    </li> */}
                  </ul>
                </div>
                <div className="col-lg-4 col-6">
                  <ul className={s.list}>
                    <li className={s.title}>Магазин</li>

                    <li className={s.item}>
                      <Link href="/o-nas">
                        <a>О нас</a>
                      </Link>
                    </li>
                    <li className={s.item}>
                      <Link href="/dostavka_i_oplata">
                        <a>Доставка и оплата</a>
                      </Link>
                    </li>
                    {/* <li className={s.item}>
                      <Link href="/help/aktsii_i_skidki">
                        <a>Акции и скидки</a>
                      </Link>
                    </li> */}

                    <li className={s.item}>
                      <Link href="/contacts">
                        <a>Контакты</a>
                      </Link>
                    </li>

                    {/* <li className={s.item}>
                      <Link href="/"><a>Накопительная система</a></Link>
                    </li> */}
                  </ul>
                </div>
                <div className="col-lg-4 col-6">
                  <ul className={s.list}>
                    <li className={s.title}>Наши социальные сети</li>
                    <ul className={s.socialList}>
                      <li className={s.item}>
                        <Link href="https://www.instagram.com/xsport2010.uz/?hl=en">
                          <a>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: icons.instagram,
                              }}
                            />
                            Instagram
                          </a>
                        </Link>
                      </li>
                      <li className={s.item}>
                        <Link href="https://t.me/xsport2010uz">
                          <a>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: icons.telegram,
                              }}
                            />
                            Telegram
                          </a>
                        </Link>
                      </li>
                      <li className={s.item}>
                        <Link href="https://ru-ru.facebook.com/Xsport2010.uz/?ref=page_internal">
                          <a>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: icons.facebook,
                              }}
                            />
                            Facebook
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className={s.copyright}>
              <div className="row">
                <div className={`col-lg-3 col-xl-3 col-md-4 col-sm-12 ${s.left}`}>
                  {`© ${new Date().getFullYear()} Xsport. Все права защищены`}
                </div>
                <div className={`col-lg-6 col-xl-6 col-md-4  col-sm-12 ${s.center}`}>
                  <ul className={s.list}>
                    <li className={s.item}>
                      <span dangerouslySetInnerHTML={{ __html: icons.click }} />{' '}
                    </li>
                    <li className={s.item}>
                      <span dangerouslySetInnerHTML={{ __html: icons.payme }} />{' '}
                    </li>
                    <li className={s.item}>
                      <span dangerouslySetInnerHTML={{ __html: icons.visa }} />{' '}
                    </li>
                  </ul>
                </div>
                <div className={`col-lg-3 col-xl-3 col-md-4 col-sm-12 ${s.right}`}>
                  <Link href="https://billz.uz">
                    <a target="_blank">
                      E-commerce решение от
                      <span dangerouslySetInnerHTML={{ __html: icons.billzLogo }} />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </footer>
);

export default Footer;
