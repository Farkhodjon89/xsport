import s from './mobile-filters.module.scss'
import Accordion from '../Accordion'
import CategoryFilter from '../CategoryFilter'
import SizeFilter from '../SizeFilter'
import ColorFilter from '../ColorFilter'
import BrandFilter from '../BrandFilter'
import React, { useState, useEffect } from 'react'
import icons from '../../public/fixture'

const MobileFilters = ({
  categoryData,
  activeButton,
  activeFilters,
  sizes,
  colors,
  brands,
  setFilterValues,
  dispatch,
  filters,
}) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const { parentCategory, categories, category } = categoryData

  const [scroll, setScroll] = useState(0)
  const [filterTop, setFilterTop] = useState(0)

  useEffect(() => {
    const filter = document.querySelector('#filter')
    setFilterTop(filter.offsetTop)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = () => {
    setScroll(window.scrollY)
  }

  return (
    <section className={scroll > filterTop + 20 ? s.sticky : ''}>
      <button onClick={() => setOpen(true)} className={`${s.filterBlock} `} id='filter'>
        <span dangerouslySetInnerHTML={{ __html: icons.filter }} />
        Фильтры
      </button>

      <div className={`${s.wrapper}  ${open && s.active}`}>
        <div className={s.filters}>
          <h3 className={s.title}>Фильтры</h3>
          <Accordion title='Категории' active={true}>
            <CategoryFilter
              categories={categories}
              category={category}
              parentCategory={parentCategory}
              getActiveStatus={setOpen}
              activeFilters={activeFilters}
              menu
            />
          </Accordion>
          <Accordion title="Бренды" active={true}>
            <BrandFilter
              brands={brands}
              active={filters.brands}
              setFilterValues={setFilterValues}
            />
          </Accordion>
          <Accordion title='Цвет'>
            <ColorFilter colors={colors} active={filters.colors} setFilterValues={setFilterValues} />
          </Accordion>
          <Accordion title='Размер'>
            <SizeFilter sizes={sizes} active={filters.sizes} setFilterValues={setFilterValues} />
          </Accordion>

          <div className={s.apply}>
            <button onClick={() => setOpen(false)} dangerouslySetInnerHTML={{ __html: icons.times }} />
          </div>
          {activeButton && (
            <div className={s.resetFilter} onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
              Сбросить фильтр
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
export default MobileFilters
