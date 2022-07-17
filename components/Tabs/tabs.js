import s from "./tabs.module.scss";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import icons from "../../public/fixture";

const SliderPrevArrow = (props) => (
  <button
    className={s.sliderPrevArrow}
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowLeft }}
  />
);

const SliderNextArrow = (props) => (
  <button
    className={s.sliderNextArrow}
    onClick={props.onClick}
    dangerouslySetInnerHTML={{ __html: icons.arrowRight }}
  />
);

const settings = {
  dots: true,
  arrows: false,
  slidesToShow: 3,
  slidesToScroll: 3,
  prevArrow: <SliderPrevArrow />,
  nextArrow: <SliderNextArrow />,
};

const Tabs = ({ data, mobileCategory }) => {
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = (id) => {
    setActiveTab(id);
  };

  const tabList = []

  for (const tab of data) {
    tabList.push(
      <li
        onClick={() => changeTab(tab.id)}
        key={tab.id}
        className={tab.id === activeTab ? s.active : ""}
      >
        {tab.name}
      </li>
    )
  }

  return (
    <section className={`${s.tab} tab`}>
      <ul
        className={`${s.tabHeader}`}
      >
        {tabList}
      </ul>
      <div className={s.tabContent}>
        {data.map((tab, i) => {
          if (tab.id == activeTab) {
            return tab.content
          }
        })}
      </div>
    </section>
  );
};

export default Tabs;
