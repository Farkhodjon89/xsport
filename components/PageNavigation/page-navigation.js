import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import icons from "../../public/fixture";
import SectionTitle from "../SectionTitle";
import s from "./page-navigation.module.scss";
import React, { useEffect, useState } from "react";

const PageNavigation = ({ navigation, activePage, openNavigation, title }) => {
  let navigationList = [];

  for (const nav of navigation) {
    navigationList.push(
      <li
        key={uuidv4()}
        className={`${s.item} ${activePage == nav.link ? s.active : ""}`}
      >
        <Link href={nav.link}>
          <a>
            {nav.title}
          </a>
        </Link>
      </li>
    );
  }

  const [windowWidth, setWindowWidth] = useState();
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    
    <div
      className={`${s.LeftNavigation} ${openNavigation ? s.activeMobile : ""}`}
    >
      {windowWidth <= 770 ? <SectionTitle title={title} /> : null}
      <ul className={s.list}>{navigationList}</ul>
    </div>
  );
};

export default PageNavigation;
