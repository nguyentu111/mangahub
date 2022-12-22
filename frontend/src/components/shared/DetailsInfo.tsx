import "react-loading-skeleton/dist/skeleton.css";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
// import { followModal } from '~/atoms/followModaAtom';
import {
  MANGA_BROWSE_PAGE,
  MANGA_PATH_NAME,
  MANGA_PATH_READ_NAME,
  // PROXY_SERVER,
  // SOURCE_COLLECTIONS,
} from "~/constants";
import useNotification from "~/hooks/useNotification";
import { Chapter, ChapterDetails, Comic } from "~/types";
// import { isExactMatch } from '~/utils/stringHandler';
// import torriGate from '/public/images/torri-gate.jpg';

import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import useFollow from "~/hooks/useFollow";
import { fork } from "child_process";
import { useTheme } from "~/context/themeContext";

interface DetailsInfoProps {
  manga: Comic;
  //   chapters?: Comic["chapters"];
  isLoading: boolean;
}

// const url = SOURCE_COLLECTIONS['NTC'];

function DetailsInfo({ manga, isLoading }: DetailsInfoProps) {
  const router = useRouter();
  const notification = useNotification();
  const follow = useFollow();
  const { data: session, status } = useSession();
  // const setShowModal = useSetAtom(followModal);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const lastChapSlug = manga?.chapters[0].slug;
  const firstChapSlug = manga?.chapters[manga.chapters.length - 1].slug;
  const [theme] = useTheme();
  //   console.log({ firstChapSlug, lastChapSlug });

  const handleTurnOnNotification = async () => {
    const response = await notification.subscribe(manga?.slug);
    switch (response) {
      case "permission_denied":
        toast.error("User-kun cần cấp quyền thông báo!", {
          duration: 2000,
          style: { zIndex: 899 },
        });
        break;
      case "unsupported_browser":
        toast.error("Trình duyệt của user-kun không hỗ trợ thông báo!", {
          duration: 2000,
          style: { zIndex: 899 },
        });
        break;
      case "success":
        toast.success("Bật thông báo thành công!", {
          duration: 2000,
          style: { zIndex: 899 },
        });
        setIsSubscribed(true);
        break;
      default:
        toast.error("Có gì đó sai sai! Hãy thử lại sau :<", {
          duration: 2000,
          style: { zIndex: 899 },
        });
    }
  };

  const handleTurnOffNotification = async () => {
    const response = await notification.unsubscribe(manga?.slug);
    switch (response) {
      case "success":
        toast.success("Tắt thông báo thành công!", {
          duration: 3000,
          style: { zIndex: 899 },
        });
        setIsSubscribed(false);
        break;
      case "error":
        toast.error("Có gì đó không đúng?, Vui lòng thử lại", {
          duration: 3000,
          style: { zIndex: 899 },
        });
        break;
    }
  };
  const handleFollow = async () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (isFollowed) {
      const res = await follow._delete(manga?.slug);
      if (res) toast.success("Bỏ lưu thành công");
      else toast.error("Có gì đó không ổn, hãy thử lại sau!");
    } else {
      const res = await follow.add(manga?.slug);
      if (res) toast.success("Lưu truyện thành công");
      else toast.error("Có gì đó không ổn, hãy thử lại sau!");
    }
    setIsFollowed(!isFollowed);
  };
  useEffect(() => {
    if (manga?.slug) {
      (async function () {
        const res = await notification.info(manga?.slug);
        if (res === "subscribed") {
          setIsSubscribed(true);
        }
      })();
    }
    // @ts-ignore
    if (manga?.slug && session?.user?.id) {
      (async function () {
        // @ts-ignore
        const res = await follow.get(manga?.slug);
        if (res === "followed") {
          setIsFollowed(true);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, manga?.slug]);

  const convertQuery = (value: string) => {
    switch (value?.toLowerCase()) {
      case "manga":
      case "manhua":
      case "manhwa":
      case "doujinshi":
        return "mangas";
      default:
        return "genres";
    }
  };

  return (
    <>
      <div className="text-black col-span-3 flex h-full w-full flex-col items-center overflow-x-hidden md:flex-row md:items-start  dark:text-white">
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* manga desc*/}
        <div className="flex h-full w-full flex-col  p-2 md:min-h-[430px] lg:ml-4  ">
          <div className=" w-full space-y-4  md:ml-2 md:text-left lg:w-[80%]">
            {isLoading ? (
              <>
                <Skeleton
                  inline={true}
                  baseColor={theme === "dark" ? "#202020" : ""}
                  highlightColor="#444"
                  className="my-2 h-[30px] overflow-hidden"
                />
                <Skeleton
                  // inline={true}
                  baseColor={theme === "dark" ? "#202020" : ""}
                  highlightColor="#444"
                  className="my-2 max-w-[70%] md:min-h-[32px]"
                />
                <Skeleton
                  // inline={true}
                  baseColor={theme === "dark" ? "#202020" : ""}
                  highlightColor="#444"
                  className="my-2 max-w-[50%] md:min-h-[32px]"
                />

                <Skeleton
                  inline={true}
                  baseColor={theme === "dark" ? "#202020" : ""}
                  highlightColor="#444"
                  className="my-2 max-w-[25%] md:min-h-[32px]"
                />
              </>
            ) : (
              <>
                {/* <h1
                    className={`font-secondary  font-bold leading-none ${
                      manga.name.length < 40
                        ? "text-[6.5vw] md:text-[5.5vw] lg:text-[3.5vw]"
                        : "text-[5.5vw] md:text-[3.5vw] lg:text-[2.5vw]"
                    }`}
                  >
                    {manga?.name}
                  </h1>
                  <div className=" m-auto text-center text-gray-500">{`[ Cập nhật lúc ${
                    manga?.statisticValue && manga?.statisticValue[0].value
                  } ]`}</div> */}
                {/* <h2 className="text-[3vw] md:min-h-[28px] md:text-[2vw] lg:text-[1.2vw]">
                  
                  </h2> */}
                {manga?.otherName &&
                  manga?.otherName?.map((v, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="font-bold">Tên khác: </span>{" "}
                      <span>{v.label}</span>
                      {/* @ts-ignore */}
                      {idx !== manga.otherName?.length - 1 && " , "}
                    </div>
                  ))}
                {manga?.author &&
                  manga.author.map((v, idx) => (
                    <div key={idx}>
                      <span className="font-bold">Tác giả: </span>
                      <Link href={v.link as string}>
                        <span className="cursor-pointer hover:text-red-500">
                          {v.label}
                        </span>
                      </Link>
                      {/* @ts-ignore */}
                      {idx !== manga.author?.length - 1 && " , "}
                    </div>
                  ))}

                {manga?.genres && (
                  <div className="flex flex-wrap">
                    <span className="font-bold whitespace-nowrap">
                      Thể loại:{" "}
                    </span>
                    {manga.genres.map((v, idx) => (
                      <Link
                        key={idx}
                        href={v.link as string}
                        className="  w-fit h-fit text-center flex justify-start mb-2"
                      >
                        <span
                          className=" bg-slate-400/25 rounded-xl cursor-pointer hover:text-red-500 
                                    backdrop-blur-2xl whitespace-nowrap mx-1 px-2 md:text-lg"
                        >
                          {v.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {manga?.status &&
                  manga.status.map((v, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="font-bold">Trạng thái: </span>
                      <Link href={v.link as string} className="">
                        <span className="cursor-pointer hover:text-red-500">
                          {v.label}
                        </span>
                      </Link>
                      {idx !== (manga.status?.length as number) - 1 && " , "}
                    </div>
                  ))}
                {/* {manga?.otherName && (
                    <div>
                      <span className="font-bold">Tên khác: </span>
                      {manga?.otherName?.map((v, idx) => (
                        <>
                          {" "}
                          <span>{v.label}</span>
                          @ts-ignore
                          {idx !== manga.otherName?.length - 1 && " , "}
                        </>
                      ))}
                    </div>
                  )}
                  <h3 className="text-center text-[3vw] md:text-left md:text-[2vw] lg:text-[1.1vw]">
                    {manga?.author !== "undefined" ? manga?.author : ""}
                  </h3>
                  <h4 className="flex items-center justify-center gap-4 md:justify-start">
                    <span
                      className={`block h-3 w-3 rounded-full ${
                        manga?.status === "Đang tiến hành"
                          ? "bg-green-500"
                          : "bg-cyan-500"
                      } `}
                    ></span>
                    {manga?.status}
                  </h4> */}
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 md:flex-col">
            {/* manga interrace  */}
            <div className="flex w-full flex-col sm:flex-row items-center  gap-6 md:my-0 md:flex-row md:items-start">
              {isLoading ? (
                <div className="flex flex-col ssm:flex-row w-full items-center justify-evenly">
                  <div className="w-[124px] h-[44px] my-2 rounded-2xl">
                    <Skeleton
                      baseColor={theme === "dark" ? "#202020" : ""}
                      highlightColor="#444"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="w-[124px] h-[44px] my-2 rounded-2xl">
                    <Skeleton
                      baseColor={theme === "dark" ? "#202020" : ""}
                      highlightColor="#444"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                manga?.chapters && (
                  <div className="flex flex-col ssm:flex-row justify-between items-center gap-5">
                    <Link
                      href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${manga.slug}/${lastChapSlug}`}
                    >
                      <button className="items-center border-2  px-2 py-2 hover:scale-105 rounded-xl border-black dark:border-white ">
                        Chap mới nhất
                      </button>
                    </Link>

                    <Link
                      href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${manga.slug}/${firstChapSlug}`}
                    >
                      <button className="items-center border-2 px-2 py-2 hover:scale-105 rounded-xl border-black dark:border-white ">
                        Đọc ngay
                      </button>
                    </Link>
                  </div>
                )
              )}

              <div className="flex w-fit gap-6">
                {!isLoading && (
                  <>
                    <button
                      onClick={handleFollow}
                      className="flex items-centers bg-hight-light p-2 rounded-xl transition-all "
                    >
                      {isFollowed ? (
                        <BookmarkIconSolid className="w-8 h-8 self-center " />
                      ) : (
                        <BookmarkIcon className="w-8 h-8 self-center " />
                      )}
                    </button>

                    <button
                      onClick={
                        isSubscribed
                          ? handleTurnOffNotification
                          : handleTurnOnNotification
                      }
                      className="absolute-center bg-hight-light p-2 rounded-xl transition-all hover:text-primary "
                    >
                      {isSubscribed ? (
                        <BellIconSolid className="animate__animated animate__faster animate__heartBeat h-8 w-8 text-red-500" />
                      ) : (
                        <BellIcon className="animate__animated animate__faster animate__heartBeat h-8 w-8" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(DetailsInfo);
