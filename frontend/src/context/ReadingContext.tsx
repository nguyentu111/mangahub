import { createContext, useContext, useState, ReactNode } from "react";
import { Chapter, NavigateDirection, Page } from "~/types";
interface ReadingContextType {
  currentChapter?: Chapter;
}
interface Props {
  children: ReactNode;
  value: ReadingContextType;
}
const readingContext = createContext<ReadingContextType | null>(null);
const ReadingContextProvider = ({ children, value }: Props) => {
  return (
    <readingContext.Provider value={value}>{children}</readingContext.Provider>
  );
};

export default ReadingContextProvider;
export const useReading = () => useContext(readingContext);
