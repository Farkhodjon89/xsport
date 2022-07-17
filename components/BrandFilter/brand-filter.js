import React from 'react';
import s from './brand-filter.module.scss';
import icons from '../../public/fixture';
import Loader from '../Loader';

const BrandFilter = ({ brands, active, setFilterValues, loading }) => {
  const brandList = [];

  const onChangeSize = (event) => {
    setFilterValues('brands', event.target.value);
  };

  for (const key in brands) {
    brandList.push(
      <div className={s.brand}>
        <label htmlFor={`brand-${key}`}>
          <input
            type="checkbox"
            value={brands[key].name}
            id={`brand-${key}`}
            checked={(active || []).includes(brands[key].name) ? 'checked' : ''}
            onChange={onChangeSize}
          />
          {brands[key].name}
          <span dangerouslySetInnerHTML={{ __html: icons.cheker }} className={s.checkmark} />
        </label>
      </div>,
    );
  }

  if (loading) {
    return <Loader />;
  } else {
    return <div className={s.brandList}>{brandList}</div>;
  }
};
export default BrandFilter;
