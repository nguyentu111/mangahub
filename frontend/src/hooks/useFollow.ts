import axios from "axios";
import { Comic } from "~/types";

export default function useFollow() {
  const add = async (userId: string, mangaSlug: string, manga: Comic) => {
    try {
      await axios.post(`/api/follow/${mangaSlug}`, {
        userId,
        manga,
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const get = async (userId: string, mangaTitle: string) => {
    try {
      const response = await axios.get(
        `/api/follow/${mangaTitle}?userId=${userId}`
      );
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const _delete = async (userId: string, mangaTitle: string) => {
    try {
      await axios.delete(`/api/follow/${mangaTitle}?userId=${userId}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { add, get, _delete };
}
