import React, { useState, useEffect, useReducer, useRef } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import InfiniteScroll from 'react-infinite-scroller'
import Loader from '../Loader'
import s from './catalog.module.scss'
import Filters from '../Filters'
import MobileFilters from '../MobileFilters'
import ProductsList from '../ProductsList'
import PRODUCTS from '../../queries/products'
import client from '../../apollo/apollo-client'
import { catalog } from '../../utils/catalog'
import { useRouter } from 'next/router'
import Skeleton from 'react-loading-skeleton'
import icons from '../../public/fixture'

const generateFilterVariables = (filters, isSale) => {
  const result = {
    first: 9,
    filters: [],
  }

  if (isSale == 'sale') {
    result.onSale = true
  }

  if (filters.colors && filters.colors.length) {
    result.filters.push({
      taxonomy: 'PACOLOR',
      terms: Array.isArray(filters.colors) ? filters.colors : [filters.colors],
    })
  }

  if (filters.sizes && filters.sizes.length) {
    result.filters.push({
      taxonomy: 'PASIZE',
      terms: Array.isArray(filters.sizes) ? filters.sizes : [filters.sizes],
    })
  }

  if (filters.brands && filters.brands.length) {
    result.filters.push({
      taxonomy: 'PABRAND',
      terms: Array.isArray(filters.brands) ? filters.brands : [filters.brands],
    })
  }

  return result
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.filters,
        products: [],
      }
    case 'SET_FILTER_VALUE':
      return {
        ...state,
        filters: { ...state.filters, [action.filter]: action.value },
        products: [],
      }
    case 'RESET_FILTERS':
      return {
        ...state,
        products: [],
        filters: {},
      }
    case 'RESET':
      return state.init ? initialState : state
    case 'SET_PRODUCTS':
      return { ...state, products: action.products }
    case 'SET_PRODUCTS_AND_PAGE_INFO':
      return {
        ...state,
        products: action.products,
        pageInfo: action.pageInfo,
        activeTerms: action.activeTerms,
      }
    case 'SET_SORTING':
      return {
        ...state,
        sortValue: action.sortValue,
      }
    default:
      throw new Error()
  }
}

const initialState = {
  filters: {},
  sortValue: 'default',
  products: null,
  pageInfo: null,
}

const CatalogMain = ({
  products,
  categories,
  category,
  parentCategory,
  pageInfo,
  activeTerms,
}) => {
  const router = useRouter()
  const { slug } = router.query

  const [windowWidth, setWindowWidth] = useState()
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  }, [])

  const [prevSortValue, setPrevSortValue] = useState('default')

  const useIsMount = () => {
    const isMountRef = useRef(true)

    useEffect(() => {
      isMountRef.current = false
    }, [])

    return isMountRef.current
  }

  const isMount = useIsMount()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    pageInfo,
    products,
    activeTerms,
  })

  const [loadProducts, { data, loading }] = useLazyQuery(PRODUCTS, { client })

  const setFilterValues = (type, value) => {
    const arrayValuesFor = ['colors', 'sizes', 'brands']

    if (value === '' || value == null) {
      const filters = { ...state.filters }
      delete filters[type]
      dispatch({
        type: 'SET_FILTERS',
        filters,
      })

      return
    }

    if (arrayValuesFor.includes(type)) {
      let options = state.filters[type] || []

      if (options.includes(value)) {
        options = options.filter((x) => x !== value)
      } else {
        options = [...options, value]
      }

      dispatch({
        type: 'SET_FILTER_VALUE',
        filter: type,
        value: options,
      })
    } else {
      dispatch({
        type: 'SET_FILTER_VALUE',
        filter: type,
        value: value,
      })
    }
  }

  const loadMore = () => {
    if (!loading && state.pageInfo.hasNextPage) {
      loadProducts({
        variables: {
          categories: category ? [category.slug] : null,
          after: state.pageInfo.endCursor,
          ...generateFilterVariables(state.filters, slug),
          orderBy: [
            {
              field:
                state.sortValue === 'lowToHigh' ||
                state.sortValue === 'highToLow'
                  ? 'PRICE'
                  : 'DATE',
              order: state.sortValue === 'lowToHigh' ? 'ASC' : 'DESC',
            },
          ],
        },
      })
    }
  }

  let locationSearch =
    typeof window !== 'undefined' ? window.location.search : ''

  useEffect(() => {
    const { filters } = catalog.init()

    if (Object.keys(filters).length) {
      dispatch({
        type: 'SET_FILTERS',
        filters: filters,
      })
    }
  }, [locationSearch])

  useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   const query = catalog.buildQuery({}, state.filters)
    //   const location = `${window.location.pathname}${query ? '?' : ''}${query}`
    //   window.history.replaceState(null, '', location)
    // }

    if (!isMount) {
      loadProducts({
        variables: {
          categories: category ? [category.slug] : null,
          ...generateFilterVariables(state.filters, slug),
          orderBy: [
            {
              field:
                state.sortValue === 'lowToHigh' ||
                state.sortValue === 'highToLow'
                  ? 'PRICE'
                  : 'DATE',
              order: state.sortValue === 'lowToHigh' ? 'ASC' : 'DESC',
            },
          ],
        },
      })
    }
  }, [state.filters])

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'SET_PRODUCTS_AND_PAGE_INFO',
        products:
          state.sortValue !== prevSortValue
            ? [...data.products.nodes]
            : [...state.products, ...data.products.nodes],
        pageInfo: data.products.pageInfo,
        activeTerms: data.products.activeTerms,
      })
      setPrevSortValue(state.sortValue)
    }
  }, [data])

  useEffect(() => {
    if (!isMount) {
      loadProducts({
        variables: {
          categories: [category?.slug],
          ...generateFilterVariables(state.filters, slug),
          orderBy: [
            {
              field:
                state.sortValue === 'lowToHigh' ||
                state.sortValue === 'highToLow'
                  ? 'PRICE'
                  : 'DATE',
              order: state.sortValue === 'lowToHigh' ? 'ASC' : 'DESC',
            },
          ],
        },
      })
    }
  }, [state.sortValue])

  let activeButton = false
  if (state.filters.sizes && state.filters.sizes.length != 0) {
    activeButton = true
  } else if (state.filters.colors && state.filters.colors.length != 0) {
    activeButton = true
  } else if (state.filters.brands && state.filters.brands.length != 0) {
    activeButton = true
  }

  return (
    <>
      <div className='row'>
        <div className='col-lg-3'>
          {windowWidth >= 1023 ? (
            <div>
              <Filters
                categoryData={{
                  parentCategory,
                  categories,
                  category,
                }}
                brands={state.activeTerms && state.activeTerms.paBrands}
                sizes={state.activeTerms && state.activeTerms.paSizes}
                colors={state.activeTerms && state.activeTerms.paColors}
                setFilterValues={setFilterValues}
                filters={state.filters}
                loading={loading}
              />
              {activeButton && (
                <div
                  className={s.resetFilter}
                  onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                >
                  Сбросить фильтр
                </div>
              )}
            </div>
          ) : (
            <div className={s.mobileFilters}>
              <MobileFilters
                categoryData={{
                  parentCategory,
                  categories,
                  category,
                }}
                activeButton={activeButton}
                dispatch={dispatch}
                brands={state.activeTerms && state.activeTerms.paBrands}
                sizes={state.activeTerms && state.activeTerms.paSizes}
                colors={state.activeTerms && state.activeTerms.paColors}
                setFilterValues={setFilterValues}
                filters={state.filters}
              />
              <div className={s.sort}>
                <div dangerouslySetInnerHTML={{ __html: icons.sort }} />
                <select
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SORTING',
                      sortValue: e.target.value,
                    })
                  }
                >
                  <option value='default'> Сортировка </option>
                  <option value='highToLow'> Цена (от высокой к низкой)</option>
                  <option value='lowToHigh'> Цена (от низкой к высокой)</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className='col-lg-9'>
          {windowWidth >= 1023 ? (
            <>
              <div className={s.sort}>
                Сортировка
                <select
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_SORTING',
                      sortValue: e.target.value,
                    })
                  }
                >
                  <option value='default'> по умолчанию </option>
                  <option value='highToLow'> Цена (от высокой к низкой)</option>
                  <option value='lowToHigh'> Цена (от низкой к высокой)</option>
                </select>
              </div>
            </>
          ) : null}
          {loading && state.products.length === 0 ? (
            <div id='catalog-skeleton-wrapper'>
              <Skeleton
                variant='rect'
                height={400}
                width={290}
                count={9}
                wrapper={({ children }) => (
                  <div className='col-lg-4 col-sm-6 col-6 col-md-6'>
                    {children}
                  </div>
                )}
              />
            </div>
          ) : state.products.length === 0 ? (
            <div className={s.emptyProduct}>
              <p>Товары не найдены</p>
            </div>
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={!loading && state.pageInfo.hasNextPage}
              initialLoad={false}
              className={s.right}
            >
              <ProductsList
                products={state.products}
                catalog={true}
                loading={loading}
              />
              {loading && <Loader />}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  )
}

export default CatalogMain
