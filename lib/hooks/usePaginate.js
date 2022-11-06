import useSWRInfinite from "swr/infinite";

export default function useItemsPaginate(url, limit, query, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    if (previousPageData && !previousPageData.items.length) return null;
    return `${url}?${new URLSearchParams(
      query
    ).toString()}&page=${pageIndex}&limit=${limit}`;
  };

  const {
    data: paginatedData,
    size,
    setSize,
    error,
    mutate,
  } = useSWRInfinite(getKey, options);

  const itemsData = paginatedData?.reduce((data, { category, items }) => {
    data[category] ??= { category: category, items: [] };
    if (Array.isArray(items)) {
      data[category].items = data[category].items.concat(items);
    } else {
      data[category].items.push(items);
    }

    return data;
  }, {});

  const endReached =
    paginatedData &&
    paginatedData[paginatedData.length - 1].items.length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  return {
    itemsData: itemsData && Object.values(itemsData)[0],
    endReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
