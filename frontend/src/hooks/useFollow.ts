import axios from "axios";
import { useSession } from "next-auth/react";
import { Comic } from "~/types";

export default function useFollow() {
  const { data: session, status } = useSession();
  //@ts-ignore
  const userId = session?.user?.id as string;
  const add = async (mangaSlug: string) => {
    try {
      await axios.post(`/api/follow/${mangaSlug}`, {
        userId,
      });

      return true;
    } catch (err) {
      // console.error(err);
      return false;
    }
  };

  const get = async (mangaSlug: string) => {
    try {
      const response = await axios.get(
        `/api/follow/${mangaSlug}?userId=${userId}`
      );
      if (response.data) return "followed";
    } catch (err) {
      console.error(err);
      return "notfollowed";
    }
  };

  const _delete = async (mangaSlug: string) => {
    try {
      await axios.delete(`/api/follow/${mangaSlug}?userId=${userId}`);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { add, get, _delete };
}
