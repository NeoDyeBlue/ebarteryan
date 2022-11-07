import useSWRInfinite from "swr/infinite";

export default function usePaginate(url, limit, query, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    if (previousPageData && !previousPageData.data.length) return null;
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

  const flattenedData = paginatedData?.map((page) => page.data).flat();

  console.log(paginatedData);

  const isEndReached =
    paginatedData &&
    paginatedData[paginatedData.length - 1].data.length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  return {
    data: flattenedData,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
