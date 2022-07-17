import React from 'react';
import s from './size-filter.module.scss';
import icons from '../../public/fixture';
import Loader from '../Loader';

const SizeFilter = ({ sizes, active, setFilterValues, loading }) => {
  const sizeList = [];

  const onChangeSize = (event) => {
    setFilterValues('sizes', event.target.value);
  };

  for (const siz in sizes) {
    sizeList.push(
      <div className={s.size}>
        <label htmlFor={`size-${siz}`}>
          <input
            type="checkbox"
            value={sizes[siz].name}
            id={`size-${siz}`}
            checked={(active || []).includes(sizes[siz].name) ? 'checked' : ''}
            onChange={onChangeSize}
          />
          {sizes[siz].name}
          <span dangerouslySetInnerHTML={{ __html: icons.cheker }} className={s.checkmark} />
        </label>
      </div>,
    );
  }

  if (loading) {
    return <Loader />;
  } else {
    return <div className={s.sizeList}>{sizeList}</div>;
  }
};
export default SizeFilter;
