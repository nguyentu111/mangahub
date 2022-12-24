import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  MANGA_PATH_DETAILS_NAME,
  MANGA_PATH_NAME,
  MANGA_PATH_READ_NAME,
} from "~/constants";
import { Comic } from "~/types";
import ImageWrapper from "../shared/ImageWrapper";

type Props = {
  comic: Comic;
  viewType: number;
};

const Card = ({ comic, viewType }: Props) => {
  return (
    <div className="">
      <div>
        <div className="aspect-w-2 aspect-h-3 rounded-md overflow-hidden relative group ">
          <Link
            href={`${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}`}
          >
            <ImageWrapper>
              <Image
                src={comic.image}
                alt=""
                fill
                className="group-hover:scale-105 transition-all duration-200"
              />
            </ImageWrapper>
            <div
              className=" text-white line-clamp-2 p-2 pt- bottom-0 absolute w-full hover:pt-[20px]
              transition-all duration-100 group-hover:bg-gradient-to-b from-transparent to-gray-800 "
              style={{ textShadow: "0 0 4px #000" }}
            >
              {comic.name}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
