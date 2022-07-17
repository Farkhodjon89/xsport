import queryString from "query-string";

function parseQueryOptions(location) {
  const query = queryString.parse(location);
  const optionValues = {};

  if (typeof query.page === "string") {
    optionValues.page = parseFloat(query.page);
  }
  if (typeof query.limit === "string") {
    optionValues.limit = parseFloat(query.limit);
  }
  if (typeof query.sort === "string") {
    optionValues.sort = query.sort;
  }

  return optionValues;
}

function parseQueryFilters(location) {
  const query = queryString.parse(location, { arrayFormat: "comma" });
  const filterValues = {};

  const multipleFilters = ["colors", "sizes", "brands"];

  Object.keys(query).forEach((param) => {
    const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

    if (!mr) {
      return;
    }

    const filterSlug = mr[1];

    if (multipleFilters.includes(filterSlug) && !Array.isArray(query[param])) {
      filterValues[filterSlug] = [query[param]];
    } else {
      filterValues[filterSlug] = query[param];
    }
  });

  return filterValues;
}

function parseQuery(location) {
  return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
  const params = {};

  if (options.page !== 1) {
    params.page = options.page;
  }

  if (options.limit !== 10) {
    params.limit = options.limit;
  }

  if (options.sort !== "default") {
    params.sort = options.sort;
  }

  Object.keys(filters)
    .filter((x) => !!filters[x])
    .forEach((filterSlug) => {
      params[`filter_${filterSlug}`] = filters[filterSlug];
    });

  return queryString.stringify(params, { encode: false, arrayFormat: "comma" });
}

function init() {
  const [options, filters] = parseQuery(
    typeof window !== "undefined" ? window.location.search : ""
  );

  return { options, filters };
}

export const catalog = {
  parseQueryOptions,
  parseQueryFilters,
  parseQuery,
  buildQuery,
  init,
};
