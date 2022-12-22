import { Inter } from "@next/font/google";
import axios from "axios";
import { GetStaticProps } from "next";
import NewComics from "~/components/features/NewComics";

const inter = Inter({ subsets: ["latin"] });
import Head from "~/components/shared/Head";
import Section from "~/components/shared/Section";
import SectionSwiper from "~/components/shared/SectionSwiper";
import { MANGA_BROWSE_PAGE, MANGA_PATH_NAME } from "~/constants";
import { axiosClient } from "~/services/axiosClient";
import { INewComics, HotComic } from "~/types";
interface Props {
  hotComics: HotComic;
  newComics: INewComics;
}
export default function Home({ hotComics, newComics }: Props) {
  return (
    <div className="dark:bg-[url('/static/media/landing_page_bg.png')] bg-cover pt-20">
      <div className="mx-auto w-[90%] max-w-[1300px]">
        <Head />
        <Section
          title="Truyện nổi bật"
          link={`/${MANGA_PATH_NAME}/${MANGA_BROWSE_PAGE}?sort=top`}
        >
          <SectionSwiper mangaList={hotComics.data} />
        </Section>
        <Section
          title="Truyện mới cập nhật"
          link={`/${MANGA_PATH_NAME}/${MANGA_BROWSE_PAGE}?sort=update`}
        >
          <NewComics comics={newComics} />
        </Section>
      </div>
    </div>
  );
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { data: hotComics } = await axiosClient.get("/lhmanga/hot-comic");
    const { data: newComics } = await axiosClient.get("/lhmanga");
    return {
      props: { hotComics, newComics },
    };
  } catch (error) {
    console.log({ error });
    return {
      notFound: true,
    };
  }
};
