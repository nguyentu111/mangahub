import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import Head from "~/components/shared/Head";
import ImageWrapper from "~/components/shared/ImageWrapper";
import { axiosClient } from "~/services/axiosClient";
import {
  Chapter,
  ChapterDetails,
  ChapterResponse,
  Comic,
  PageInfo,
} from "~/types";
type Props = {
  data: Chapter;
};
interface Params extends ParsedUrlQuery {
  slug: string[];
}
// type Props = {};
interface ReadPageProps {
  pagesDetail: PageInfo;
  chaptersDetail: ChapterDetails;
}

const ReadPage = ({ data }: Props) => {
  // const { chapter, comicSlug, pages } = data;
  const { isFallback } = useRouter();

  return (
    <div className="dark:bg-[url('/static/media/landing_page_bg.png')] bg-cover  pt-20 min-h-screen">
      <div className="w-[90%] max-w-[1300px] mx-auto ">
        {!isFallback && <Head title={data?.chapter + " | Manga hub"} />}
        <div className="mt-24">
          {isFallback
            ? "loading ..."
            : data?.pages?.map((image) => (
                <div key={image.id} className="mx-auto ">
                  {/*  eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt="image"
                    className="mx-auto max-w-[100%]"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return { paths: [], fallback: true };
};

// `getStaticPaths` requires using `getStaticProps`
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const {
      slug: [mangaSlug, chapterSlug],
    } = context.params as Params;
    const { data } = await axiosClient.get(
      "lhmanga/comic/" + mangaSlug + "/" + chapterSlug
    );
    if (!data)
      return {
        notFound: true,
      };
    else {
      return {
        props: { data },
        revalidate: 5 * 60 * 60,
      };
    }
  } catch (err) {
    return { notFound: true };
  }
};
