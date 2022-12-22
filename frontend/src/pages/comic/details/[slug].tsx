import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Skeleton from "react-loading-skeleton";
import { ParsedUrlQuery } from "querystring";
import ImageWrapper from "~/components/shared/ImageWrapper";
import { axiosClient } from "~/services/axiosClient";
import { Comic } from "~/types";
import Image from "next/image";
import Link from "next/link";
import Head from "~/components/shared/Head";
import DetailsInfo from "~/components/shared/DetailsInfo";

import ClientOnly from "~/components/shared/ClientOnly";
import { useState } from "react";
import { MANGA_PATH_NAME, MANGA_PATH_READ_NAME } from "~/constants";
import { followModal } from "~/atoms";
import { useAtom, useAtomValue } from "jotai";
import { BellIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import useFollow from "~/hooks/useFollow";
import { useRouter } from "next/router";
type Props = {
  comic: Comic;
};
interface Params extends ParsedUrlQuery {
  slug: string;
}

const Details: NextPage<Props> = ({ comic }) => {
  const [hideSummary, setHideSummary] = useState(true);
  const [followModalState, setFollowModel] = useAtom(followModal);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chapters, setChapters] = useState();
  // comic?.chapters?.chapters_list[0].chapters || []
  // @ts-ignore
  const userId = session?.user?.id;
  const { add } = useFollow();
  // console.log({ userId });
  const handleAddFollow = async () =>
    console.log(await add(userId, comic.slug, comic));
  return (
    <>
      <Head
        title={`${comic ? comic?.name + " - " : ""}  Manga-hub`}
        description={`${comic?.summary}`}
      />
      {/* <ClientOnly> */}
      <div className="pt-20 dark:bg-[url('/static/media/landing_page_bg.png')] bg-no-repeat  bg-cover pb-[40px] dark:text-white transition duration-300">
        <div className="flex flex-col w-[90%] max-w-[1300px] mx-auto justify-center items-center ">
          <div className="mt-10 w-full ">
            <h1 className="text-2xl w-full text-center uppercase md:text-3xl">
              {comic?.name}
            </h1>

            <div className=" m-auto text-center text-gray-500">{`[ Cập nhật lúc ${
              comic?.statisticValue && comic?.statisticValue[0].value
            } ]`}</div>

            <div className="flex flex-col gap-8 md:gap-10">
              <div className="flex flex-col items-center sm:items-start sm:grid sm:grid-cols-4 gap-[20px] mt-8">
                <div className="col-span-1 mt-4 w-[50%] md:w-[250px] md:min-w-[250px]">
                  {router.isFallback ? (
                    <Skeleton
                      inline={true}
                      baseColor="#202020"
                      highlightColor="#444"
                      className="aspect-w-3 aspect-h-5 relative"
                      style={{
                        borderRadius: "2%",
                      }}
                    />
                  ) : (
                    <figure className="aspect-w-3 aspect-h-5 relative rounded-2xl">
                      <Image
                        className="absolute inset-0 rounded-2xl object-cover object-center"
                        fill
                        alt="manga-thumbnail"
                        src={
                          // manga?.thumbnail
                          //   ? isExactMatch(manga.thumbnail, "res.cloudinary.com")
                          //     ? manga.thumbnail
                          //     : `${PROXY_SERVER}/proxy?url=${url}&src=${manga.thumbnail}`
                          //   : torriGate
                          comic.image
                        }
                      />
                    </figure>
                  )}
                </div>
                <div className="w-full sm:col-span-3 flex flex-col gap-4">
                  <DetailsInfo
                    isLoading={router.isFallback}
                    manga={comic}
                    // chapters={chaptersInfo}
                  />
                </div>
              </div>

              {/* tom tat */}
              <div className="relative">
                <div className="text-md font-bold">Tóm tắt</div>
                <div
                  className={` md:pb-[40px] overflow-hidden ${
                    hideSummary ? "pb-10 " : ""
                  }`}
                >
                  <p
                    className={`text-lg md:text-xl   ${
                      hideSummary
                        ? "!max-h-[100px]  md:max-h-[300px]  text-transparent bg-clip-text bg-gradient-to-b from-black to-white dark:from-white dark:to-slate-700 "
                        : ""
                    }`}
                  >
                    {comic?.summary}
                  </p>
                </div>

                <div
                  className={`text-md font-semibold w-full cursor-pointer ${
                    hideSummary && "absolute top-0 h-full "
                  }`}
                  onClick={() => setHideSummary(!hideSummary)}
                >
                  <span className={hideSummary ? "absolute bottom-0 " : ""}>
                    {hideSummary ? "Xem thêm" : "Ẩn đi"}
                  </span>
                </div>
              </div>
              {/* danh sach chuong */}
              <div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold">Danh sách chương</h3>
                  <div className=" ">
                    {comic?.chapters.map((chap) => (
                      <Link
                        href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${comic.slug}/${chap.slug}`}
                        className="flex justify-between p-2 odd:bg-slate-100 even:bg-slate-300 hover:bg-slate-400
                         dark:odd:bg-slate-500 dark:even:bg-transparent dark:hover:bg-slate-400 "
                        key={chap.link}
                      >
                        <span className="truncate">{chap.title}</span>
                        <span>{chap.time}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </ClientOnly> */}
    </>
  );
};

export default Details;
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return { paths: [], fallback: true };
};

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { slug } = context.params as Params;
  try {
    const { data } = await axiosClient.get("lhmanga/comic/" + slug);
    if (!data) return { notFound: true };
    return {
      props: {
        comic: data,
      },
      revalidate: 5 * 60 * 60,
    };
  } catch (err) {
    return { notFound: true };
  }
};
