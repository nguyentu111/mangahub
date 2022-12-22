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
import { BellIcon as BellIconSolid, BoltIcon } from "@heroicons/react/24/solid";

interface DetailsInfoProps {
  manga: Comic;
  //   chapters?: Comic["chapters"];
  isLoading: boolean;
}

// const url = SOURCE_COLLECTIONS['NTC'];

function DetailsInfo({ manga, isLoading }: DetailsInfoProps) {
  const router = useRouter();
  const notification = useNotification();
  const { data: session, status } = useSession();
  // const setShowModal = useSetAtom(followModal);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const lastChapSlug = manga?.chapters[0].slug;
  const firstChapSlug = manga?.chapters[manga.chapters.length - 1].slug;
  //   console.log({ firstChapSlug, lastChapSlug });
  const handleShowFollowModal = () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // setShowModal(true);
  };

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
        toast.error("Có gì đó không đúng?, Vui lòng thử lại!", {
          duration: 3000,
          style: { zIndex: 899 },
        });
        break;
    }
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
      <div className="col-span-3 flex h-full w-full flex-col items-center overflow-x-hidden md:flex-row md:items-start">
        <Toaster position="bottom-center" reverseOrder={false} />

        {/* manga desc*/}
        <div className="flex h-full w-full flex-col justify-center p-4  text-white md:min-h-[430px] lg:ml-4">
          <div className="w-full space-y-4 text-center md:ml-2 md:text-left lg:w-[80%]">
            {isLoading ? (
              <>
                <Skeleton
                  inline={true}
                  baseColor="#202020"
                  highlightColor="#444"
                  className="my-2 h-[35px] overflow-hidden"
                />
                <Skeleton
                  inline={true}
                  baseColor="#202020"
                  highlightColor="#444"
                  className="my-2 max-w-[50%] md:min-h-[28px]"
                />
                <Skeleton
                  inline={true}
                  baseColor="#202020"
                  highlightColor="#444"
                  className="my-2 max-w-[30%] md:min-h-[28px]"
                />

                <Skeleton
                  inline={true}
                  baseColor="#202020"
                  highlightColor="#444"
                  className="my-2 max-w-[25%] md:min-h-[28px]"
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
                    <div key={idx}>
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
                    <div key={idx}>
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
          <div className="mt-4 flex flex-col-reverse gap-2 md:flex-col">
            {isLoading ? (
              <Skeleton
                inline={true}
                baseColor="#202020"
                highlightColor="#444"
                className="my-4 max-w-[80%] md:min-h-[50px]"
              />
            ) : (
              <ul className="my-4 flex flex-wrap items-center gap-4">
                {/* <h3 className="px-2 py-2">Thể loại:</h3>
                  {manga?.genres.length &&
                    manga?.genres.map((genre) => {
                      if (!genre) return;
    
                      return (
                        <li
                          key={genre._id}
                          className="rounded-xl bg-highlight px-4 py-2"
                        >
                          <Link
                            href={{
                              pathname: `/${MANGA_BROWSE_PAGE}`,
                              query: {
                                [convertQuery(genre?.label)]: genre?.value,
                              },
                            }}
                          >
                            <a>{genre?.label}</a>
                          </Link>
                        </li>
                      );
                    })} */}
              </ul>
            )}

            {/* manga interrace  */}
            <div className="my-6 flex h-[150px] w-full flex-col items-center gap-6 md:my-0 md:flex-row md:items-start">
              {manga?.chapters ? (
                <>
                  <Link
                    href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${firstChapSlug}`}
                  >
                    <button className="pulse-effect-primary absolute-center h-[50px] w-[150px] gap-3 rounded-2xl bg-primary transition-all hover:scale-[110%]">
                      <BookOpenIcon className="h-8 w-8" /> Đọc ngay
                    </button>
                  </Link>

                  <Link
                    href={`/${MANGA_PATH_NAME}/${MANGA_PATH_READ_NAME}/${lastChapSlug}`}
                  >
                    <button className="pulse-effect-secondary absolute-center h-[50px] w-[150px] gap-3 rounded-2xl bg-white text-gray-800 transition-all hover:scale-[110%]">
                      <BoltIcon className="h-8 w-8 text-primary" /> Chap mới
                      nhất
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="absolute-center loading-pulse h-[50px] min-h-[50px] w-[150px] rounded-2xl bg-white/20"></div>

                  <div className="absolute-center loading-pulse h-[50px] min-h-[50px] w-[150px] rounded-2xl bg-white/20"></div>
                </>
              )}

              <div className="flex w-fit space-x-2">
                <button
                  onClick={handleShowFollowModal}
                  className="shine-effect absolute-center bg-hight-light h-[50px] w-[50px] rounded-xl transition-all hover:text-primary"
                >
                  <BookmarkIcon className="h-8 w-8" />
                </button>

                <button
                  onClick={
                    isSubscribed
                      ? handleTurnOffNotification
                      : handleTurnOnNotification
                  }
                  className="absolute-center bg-hight-light h-[50px] w-[50px] rounded-xl transition-all hover:text-primary"
                >
                  {isSubscribed ? (
                    <BellIconSolid className="animate__animated animate__faster animate__heartBeat h-8 w-8 text-primary" />
                  ) : (
                    <BellIcon className="animate__animated animate__faster animate__heartBeat h-8 w-8" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(DetailsInfo);
