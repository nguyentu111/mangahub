import React from "react";
import { Comic } from "~/types";
import Card from "./Card";

type Props = {
  comics: Comic[];
  viewType: number;
  isLoading: boolean;
};

const ListView = ({ comics, viewType, isLoading }: Props) => {
  return (
    <div className="grid grid-cols-1 ssm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 ">
      {comics.map((comic) => (
        <Card comic={comic} key={comic.slug} viewType={viewType} />
      ))}
    </div>
  );
};

export default ListView;
