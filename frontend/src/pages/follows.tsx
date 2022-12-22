import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
interface ComicFollowed {
  comics: { slug: string }[];
  userId: string;
}
const ComicFollowed: NextPage = () => {
  const { data: session } = useSession();
  const { data } = useSWR<ComicFollowed>(`/api/users/follows`, async (url) => {
    return await (
      await axios.get(url, {
        headers: {
          //@ts-ignore
          userId: session?.user.id,
        },
      })
    ).data;
  });
  console.log(data);

  return (
    <div className="pt-20 dark:bg-[url('/static/media/landing_page_bg.png')] bg-no-repeat  bg-cover pb-[40px] dark:text-white transition duration-300 h-screen">
      <div className="flex flex-col w-[90%] max-w-[1300px] mx-auto justify-center items-center ">
        {data
          ? data?.comics.map((comic) => (
              <div key={comic.slug}>{comic.slug}</div>
            ))
          : "ko co "}
      </div>
    </div>
  );
};
export default ComicFollowed;
// export const getServerSideProps: GetServerSideProps = async ({
//   query,
//   res,
// }) => {
//   try {
//     const { data } = await axios.get("/user/follows");
//     console.log({ data });

//     return {
//       props: {},
//     };
//   } catch (err) {
//     return { notFound: true };
//   }
// };
