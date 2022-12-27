import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import classNames from "classnames";
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from "~/constants";
import { Comic, VistedComic } from "~/types";
import { motion } from "framer-motion";
type Props = {
  comic: Comic | VistedComic;
  viewType: number;
  isLoading: boolean;
};

const Card = ({ comic, viewType, isLoading }: Props) => {
  return (
    <motion.div
      layout
      className={classNames("relative inline-block p-2 dark:text-white")}
    >
      <motion.div
        layout
        className={classNames(
          " w-full h-full rounded-md",
          viewType === 0 && " p-2 flex dark:bg-[#444444]",
          viewType === 1 && " p-2 flex dark:bg-[#444444]"
        )}
      >
        <div
          className={classNames(
            viewType === 0
              ? "block w-[64px] h-[91px] md:w-[80px] md:h-[114px] flex-none "
              : viewType === 2
              ? "aspect-w-2 aspect-h-3  flex items-start  mb-auto"
              : "block w-[80px] h-[114px] md:w-[90px] md:h-[128px] flex-none ",
            " rounded-md overflow-hidden group select-none cover relative "
          )}
        >
          <div
          // className=""
          // initial={{ width: 0 }}
          // animate={{  }}
          // className={classNames(viewType===2 && 'max-w-[100%]')}
          >
            <Link
              href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}`}
            >
              <Image
                blurDataURL="/static/media/lazy_loading.gif"
                placeholder="blur"
                src={isLoading ? "/static/media/lazy_loading.gif" : comic.image}
                alt=""
                fill
                className={classNames(
                  viewType === 2 && "group-hover:scale-105"
                )}
              />
            </Link>
          </div>
        </div>
        <div
          className={classNames(
            "overflow-hidden",
            viewType !== 2 && " w-full pl-2 md:pl-4 "
          )}
        >
          <Link
            href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}}`}
            className={classNames(
              " text-sm md:text-lg line-clamp-2",
              viewType !== 2 && "dark:text-white font-bold",
              viewType === 2 &&
                "line-clamp-2 group-hover:bg-gradient-to-b from-transparent to-gray-800 "
            )}
            style={{ textShadow: "0 0 4px #000" }}
          >
            {comic.name}
          </Link>
          <div
            className={classNames(
              viewType === 0 && "!block",
              viewType === 2 && "hidden"
            )}
          >
            {comic.genres?.map((genre, index) => (
              <Link
                href={genre.slug}
                key={index}
                className="text-sm bg-[#4f4f4f] rounded-sm mx-1"
              >
                {genre.label}
              </Link>
            ))}
          </div>
          <span
            className={classNames(
              "hidden text-sm",
              viewType !== 2 && "line-clamp-3"
            )}
          >
            {comic.summary}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(Card);
