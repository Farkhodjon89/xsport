import s from './menu-tabs.module.scss';
import React, { useState } from 'react';
// import Slider from 'react-slick';
// import icons from '../../public/fixture';

const MenuTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = (id) => {
    setActiveTab(id);
  };

  const tabList = [];

  for (const tab of data) {
    tabList.push(
      <li
        onClick={() => changeTab(tab.id)}
        key={tab.id}
        className={`${s.item} ${tab.id === activeTab ? s.active : ''}`}>
        {tab.name}
      </li>,
    );
  }
  return (
    <section className={`${s.menuTabs} tab`}>
      <ul className={`${s.list}`}>{tabList}</ul>
      <div className={s.tabContent}>
        {data.map((tab, i) => {
          if (tab.id == activeTab) {
            return <div key={i}>{tab.content}</div>;
          }
        })}
      </div>
    </section>
  );
};

export default MenuTabs;
