import { useRouter } from "next/router";

export default function usePushQuery() {
  const router = useRouter();

  const query = {
    push: (
      query: { [key: string]: string | number },
      refreshPage?: boolean,
      isShallow?: boolean
    ) => {
      const queryObj = {
        ...router.query,
        ...query,
      };

      if (refreshPage) {
        const { page } = queryObj;
        if (page) {
          delete queryObj.page;
        }
      }

      router.replace(
        {
          pathname: router.pathname,
          query: queryObj,
        },
        undefined,
        { shallow: !!isShallow }
      );
    },
  };

  return query;
}
