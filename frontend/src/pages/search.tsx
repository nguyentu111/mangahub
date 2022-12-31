import { GetServerSideProps } from "next";
import AdvanceFilter from "~/components/features/AdvanceFilter";
import { axiosClient } from "~/services/axiosClient";
import { ComicCard, Genre } from "~/types";
type Props = {
  data: {
    meta: {
      totalPage: number | null;
    };
    comics: ComicCard[];
  };
  genres: { data: Genre[] };
};

export const Search = ({ data, genres }: Props) => {
  console.log(data.comics);
  return (
    <div className="-mx-[4%]">
      <AdvanceFilter genres={genres} />
    </div>
  );
};
export default Search;
export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { q, artist, status, sort, accept_genres, reject_genres, page } = query;
  try {
    const [{ data }, { data: genres }] = await Promise.all([
      axiosClient.get("/lhmanga/filter", {
        params: {
          q,
          artist,
          status,
          sort,
          accept_genres,
          reject_genres,
          page,
        },
      }),
      axiosClient.get("/lhmanga/genres"),
    ]);
    return {
      props: {
        data,
        genres,
      },
    };
  } catch (err) {
    return {
      props: {
        data: null,
      },
    };
  }
};
