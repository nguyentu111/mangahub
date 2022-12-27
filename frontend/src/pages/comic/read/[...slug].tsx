import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import Head from "~/components/shared/Head";
import useFollow from "~/hooks/useFollow";
import { axiosClient } from "~/services/axiosClient";
import { Chapter, ChapterDetails, PageInfo, VistedComic } from "~/types";
type Props = {
  data: Chapter;
};
interface Params extends ParsedUrlQuery {
  slug: string[];
}
// type Props = {};
// interface ReadPageProps {
//   pagesDetail: PageInfo;
//   chaptersDetail: ChapterDetails;
// }

const ReadPage = ({ data }: Props) => {
  // const { chapter, comicSlug, pages } = data;
  const follow = useFollow();
  const { isFallback } = useRouter();
  const [_, setReadingHistory] = useLocalStorage(
    "visited-comics",
    [] as VistedComic[]
  );
  useEffect(() => {
    if (!isFallback) {
      (async () => {
        try {
          await follow.setReaded(data?.slug, data?.chapter);
        } catch (err) {
          console.log(err);
        }
      })();
      setReadingHistory((prev) => {
        if (!prev.find((comic) => comic.slug === data.slug)) {
          prev.push({
            chapterSlug: [],
            name: data.name,
            image: data.image,
            // @ts-ignore
            slug: data.slug,
            genres: data.genres,
            summary: data.summary,
          });
        }
        if (
          !prev
            .find((comic) => comic.slug === data.slug)
            ?.chapterSlug.find((chap) => chap === data.chapter)
        ) {
          prev
            .find((comic) => comic.slug === data.slug)
            ?.chapterSlug.push(data.chapter);
        }
        return prev;
      });
    }
  }, [isFallback, data]);
  return (
    <div className="dark:bg-[url('/static/media/landing_page_bg.png')] bg-cover  pt-20 min-h-screen">
      <div className="w-[90%] max-w-[1300px] mx-auto ">
        {!isFallback && <Head title={data?.chapter + " | Manga hub"} />}
        <div className="mt-24 dark:text-white">
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
        revalidate: 18000,
      };
    }
  } catch (err) {
    return { notFound: true };
  }
};
