import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import Head from "~/components/shared/Head";
import ImageWrapper from "~/components/shared/ImageWrapper";
import Section from "~/components/shared/Section";
import TabSelect from "~/components/shared/TabSelect";
import useFollow from "~/hooks/useFollow";
import { Comic } from "~/types";
import ListIcon from "~/components/icons/ListIcon";
import LListIcon from "~/components/icons/LListIcon";
import SListIcon from "~/components/icons/SListIcon";
import Link from "next/link";
import {
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  MANGA_PATH_READ_NAME,
} from "~/constants";
import { CheckIcon, HeartIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { toast, Toaster } from "react-hot-toast";
interface ExtendedComic extends Comic {
  unfollowed: boolean;
  readed: string;
}
interface ComicFollowed {
  data: {
    comics: ExtendedComic[];
    userId: string;
  };
  meta: {
    totalPages: string;
    curentPage: string;
  };
}
const tabIcons: ReactNode[] = [
  <ListIcon style="w-5 h-5" key={1} />,
  <LListIcon style="w-5 h-5" key={1} />,
  <SListIcon style="w-5 h-5" key={1} />,
];
const ComicFollowed: NextPage = () => {
  const { data: session, status } = useSession();
  const [followingComics, setFollowingComics] = useState<null | ComicFollowed>(
    null
  );
  const [viewType, setViewType] = useState(1);
  const follow = useFollow();
  const handleSelectValue = (type: number) => {
    setViewType(type);
  };
  useEffect(() => {
    (async () => {
      const follows = await follow.getAllFollows();
      if (follows?.data) {
        setFollowingComics(follows);
        console.log(follows);
        // setLoading(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);
  const handleCheckReaded = async (
    slug: string,
    chapterSlug: string,
    index: number
  ) => {
    try {
      const res = await follow.setReaded(slug, chapterSlug);
      if (res) {
        const newFollowed = { ...(followingComics as ComicFollowed) };
        newFollowed.data.comics[index].readed = chapterSlug;
        setFollowingComics(newFollowed);
      } else if (!res) toast.error("Hệ thống đang có lỗi, hãy thử lại sau");
    } catch (e) {
      console.log(e);
      toast.error("Hệ thống đang có lỗi, hãy thử lại sau");
    }
  };
  const handleUnfollow = async (slug: string, index: number) => {
    try {
      const res = await follow._delete(slug);
      if (res) {
        toast.success("Bỏ theo dõi thành công", { duration: 1000 });
        const newFollowed = { ...(followingComics as ComicFollowed) };
        newFollowed.data.comics[index].unfollowed = true;
        console.log(newFollowed?.data.comics);

        setFollowingComics(newFollowed);
      } else if (!res)
        toast.error("Hệ thống đang có lỗi, hãy thử lại sau", {
          duration: 1000,
        });
    } catch (e) {
      console.log({ e });
      toast.error("Hệ thống đang có lỗi, hãy thử lại sau!", { duration: 1000 });
    }
  };
  const handleFollow = async (slug: string, index: number) => {
    try {
      const res = await follow.add(slug);

      if (res) {
        toast.success("Theo dõi thành công", { duration: 1000 });
        const newFollowed = { ...(followingComics as ComicFollowed) };
        newFollowed.data.comics[index].unfollowed = false;
        setFollowingComics(newFollowed);
      } else if (!res)
        toast.error("Hệ thống đang có lỗi, hãy thử lại sau", {
          duration: 1000,
        });
    } catch (e) {
      toast.error("Hệ thống đang có lỗi, hãy thử lại sau", { duration: 1000 });
    }
  };
  return (
    <div className="pt-20 dark:bg-[url('/static/media/landing_page_bg.png')] bg-no-repeat  bg-cover pb-[40px]  transition duration-300 min-h-screen">
      {session?.user?.name && (
        <Head title={`Theo dõi - ${session?.user?.name} | Manga hub`} />
      )}
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="flex flex-col w-[90%] max-w-[1300px] mx-auto">
        <Section title="Truyện đã lưu" style="mx-auto" />
        {/* <div className="ml-auto">
          <TabSelect selections={tabIcons} selectActions={handleSelectValue} />
        </div>
        <Section>
          {followingComics?.data.comics && (
            <ListView
              isLoading={!!followingComics}
              comics={followingComics?.data.comics}
              viewType={viewType}
            />
          )}
        </Section> */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="whitespace-nowrap bg-slate-300 uppercase font-bold dark:text-black">
                <td />
                <td className="p-2">Tên truyện</td>
                <td className="p-2">Xem gần nhất</td>
                <td className="p-2">chap mới nhất</td>
              </tr>
            </thead>
            <tbody>
              {followingComics?.data.comics.map((comic, index) => (
                <tr key={comic.slug} className="border-b-[1px]">
                  <td className="p-2">
                    <Link
                      href={`${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${comic.slug}`}
                      className={
                        "w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] block"
                      }
                    >
                      <ImageWrapper>
                        <Image
                          src={comic.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </ImageWrapper>
                    </Link>
                  </td>
                  <td className="p-2 text-blue-500 font-bold align-top">
                    <Link
                      href={`${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}`}
                      className=" hover:text-purple-500 leading-4"
                    >
                      {comic.name}
                    </Link>
                    <div className="flex flex-col md:flex-row md:gap-5 my-2">
                      {comic.readed === comic.chapters[0].slug ? null : (
                        <span
                          className="flex items-center text-green-500 cursor-pointer w-fit text-sm"
                          onClick={() =>
                            handleCheckReaded(
                              comic.slug,
                              comic.chapters[0].slug,
                              index
                            )
                          }
                        >
                          <CheckIcon className="w-4 h-4 font-bold mr-3" />
                          Đã đọc
                        </span>
                      )}
                      {!followingComics.data.comics[index].unfollowed ? (
                        <span
                          className="flex items-center text-red-500 cursor-pointer w-fit text-sm"
                          onClick={() => handleUnfollow(comic.slug, index)}
                        >
                          <XMarkIcon className="w-4 h-4 font-bold mr-3" />
                          Bỏ theo dõi
                        </span>
                      ) : (
                        <span
                          className="flex items-center text-red-500 cursor-pointer w-fit text-sm"
                          onClick={() => handleFollow(comic.slug, index)}
                        >
                          <HeartIcon className="w-5 h-5" />
                          Theo dõi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-sm text-gray-600 italic dark:text-gray-400">
                    {"1 h truoc"}
                  </td>
                  <td className="p-2">
                    <Link
                      href={`${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${comic.slug}/${comic.chapters[0].slug}`}
                      className={`hover:text-blue-500 dark:text-white ${
                        comic.readed === comic.chapters[0].slug &&
                        "!text-gray-400"
                      }`}
                    >
                      {comic.chapters[0].title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ComicFollowed;
