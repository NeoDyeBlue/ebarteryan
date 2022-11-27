import useSWRInfinite from "swr/infinite";

export default function usePaginate(url, limit, query, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    // console.log(pageIndex);
    if (previousPageData && !previousPageData.data) return null;
    if (query && Object.keys(query).length) {
      // console.log(pageIndex, query);
      return `${url}?${new URLSearchParams(
        query
      ).toString()}&page=${pageIndex}&limit=${limit}`;
    } else {
      return `${url}?page=${pageIndex}&limit=${limit}`;
    }
  };

  const {
    data: paginatedData,
    size,
    setSize,
    error,
    mutate,
  } = useSWRInfinite(getKey, options);

  const isEndReached =
    paginatedData &&
    paginatedData[paginatedData.length - 1].data.docs.length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  const totalDocs = paginatedData
    ? paginatedData[paginatedData.length - 1].data.totalDocs
    : 0;
  return {
    data: paginatedData,
    totalDocs,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
