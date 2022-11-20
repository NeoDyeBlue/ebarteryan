import useSWRInfinite from "swr/infinite";

export default function usePaginate(url, limit, query, options) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
    if (previousPageData && !previousPageData.data.length) return null;
    if (query && Object.keys(query).length) {
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

  const flattenedData = paginatedData?.map((page) => page.data.docs).flat();

  const isEndReached =
    paginatedData &&
    paginatedData[paginatedData.length - 1].data.docs.length < limit;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined";

  const totalDocs = paginatedData && paginatedData[0].data.totalDocs;

  return {
    data: flattenedData,
    totalDocs,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
