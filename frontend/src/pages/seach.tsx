import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { axiosClient } from "~/services/axiosClient";
import { ComicCard } from "~/types";

type Props = {
  data: {
    meta: {
      totalPage: number | null;
    };
    comics: ComicCard[];
  };
};

const seach: NextPage = ({ data }: Props) => {
  return <div>seach</div>;
};

export default seach;
export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { q, artist, status, sort, accept_genres, reject_genres } = query;
  console.log({ q, artist, status, sort, accept_genres, reject_genres });
  try {
    const { data } = await axiosClient.get("/lhmanga/filter", {
      params: {
        q,
        artist,
        status,
        sort,
        accept_genres,
        reject_genres,
      },
    });
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      props: {
        data: null,
      },
    };
  }
};
