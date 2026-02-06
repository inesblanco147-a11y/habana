import { useInfiniteQuery } from "@tanstack/react-query";
import { get_doctors } from "@/api/doctors";

export const useExternalDoctors = () => {
  return useInfiniteQuery({
    queryKey: ["external_doctors"],
    queryFn: get_doctors,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("page")) || undefined;
    },
  });
};
