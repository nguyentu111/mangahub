import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MANGA_PATH_DETAILS_NAME, MANGA_PATH_NAME } from "~/constants";
import { Comic, INewComics } from "~/types";
import ImageWrapper from "../shared/ImageWrapper";

type Props = {};

const NewComics = ({ comics }: { comics: INewComics }) => {
  return (
    <>
      <div
        className="grid grid-cols-1 ssm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
      lg:grid-cols-6 gap-x-2 gap-y-6  overflow-hidden transition-all duration-300 "
      >
        {comics.data.map((comic, key) => (
          <div
            key={key}
            className="flex flex-col rounded-xl overflow-hidden dark:text-white"
          >
            <div className="aspect-h-4 aspect-w-3 rounded-xl overflow-hidden">
              <Link
                href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}`}
              >
                <ImageWrapper>
                  <Image
                    src={comic.image as string}
                    alt=""
                    fill
                    className="absolute object-cover top-0 left-0   object-center block hover:scale-110 transition duration-400"
                  />
                </ImageWrapper>
              </Link>
            </div>
            <Link
              href={`/${MANGA_PATH_NAME}/${MANGA_PATH_DETAILS_NAME}/${comic.slug}`}
            >
              <h1 className="text-sm line-clamp-3 hover:text-red-500 sm:text-md md:text-lg">
                {comic.name}
              </h1>
            </Link>
            <span className=" text-sm ">{comic.newChap}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default NewComics;
