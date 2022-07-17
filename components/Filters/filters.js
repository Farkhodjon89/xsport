import s from './filters.module.scss';
import Accordion from '../Accordion';
import CategoryFilter from '../CategoryFilter';
import SizeFilter from '../SizeFilter';
import ColorFilter from '../ColorFilter';
import React from 'react';
import BrandFilter from '../BrandFilter';

const Filters = ({ categoryData, sizes, colors, brands, setFilterValues, filters, loading }) => {
  const { parentCategory, categories, category } = categoryData;
  // console.log(sizes);
  return (
    <div className={s.wrapper}>
      <Accordion title="Категории" active={true}>
        <CategoryFilter
          categories={categories}
          category={category}
          parentCategory={parentCategory}
        />
      </Accordion>
      <Accordion title="Бренды" active={true}>
        <BrandFilter
          brands={brands}
          loading={loading}
          active={filters.brands}
          setFilterValues={setFilterValues}
        />
      </Accordion>
      {/*<Accordion title="Цвет" active={false}>*/}
      {/*  <ColorFilter*/}
      {/*    loading={loading}*/}
      {/*    colors={colors}*/}
      {/*    active={filters.colors}*/}
      {/*    setFilterValues={setFilterValues}*/}
      {/*  />*/}
      {/*</Accordion>*/}
      <Accordion title="Размер" active={false}>
        <SizeFilter
          loading={loading}
          sizes={sizes}
          active={filters.sizes}
          setFilterValues={setFilterValues}
        />
      </Accordion>
    </div>
  );
};
export default Filters;
