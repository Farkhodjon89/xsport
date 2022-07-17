import React from 'react';
import Loader from '../Loader';
import s from './color-filter.module.scss';

const ColorFilter = ({ colors, active, setFilterValues, loading }) => {
  const colorList = [];

  for (const color of colors) {
    colorList.push(
      <button
        className={`${s.color} ${(active || []).includes(color.name) ? s.active : ''}`}
        onClick={() => setFilterValues('colors', color.name)}
        style={{ background: color.color }}
      />,
    );
  }
  if (loading) {
    return <Loader />;
  } else {
    return <div className={s.colorList}>{colorList}</div>;
  }
};
export default ColorFilter;
