import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";

export default function usePaginate(
  url,
  limit,
  query,
  options,
  shouldFetch = true
) {
  const getKey = (pageIndex, previousPageData) => {
    pageIndex += 1;
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
  } = useSWRInfinite(shouldFetch ? getKey : null, options);

  const flattened = useMemo(() => {
    return paginatedData &&
      paginatedData[paginatedData?.length - 1]?.data?.docs?.length
      ? paginatedData.map((page) => page.data.docs).flat()
      : [];
  }, [paginatedData]);

  const isEndReached =
    paginatedData &&
    paginatedData[paginatedData?.length - 1]?.data?.docs?.length < limit
      ? true
      : false;

  const isLoading =
    paginatedData && typeof paginatedData[size - 1] === "undefined"
      ? true
      : false;

  const totalDocs = paginatedData
    ? paginatedData[paginatedData?.length - 1]?.data?.totalDocs
    : 0;
  return {
    data: flattened,
    totalDocs,
    isEndReached,
    isLoading,
    size,
    setSize,
    error,
    mutate,
  };
}
