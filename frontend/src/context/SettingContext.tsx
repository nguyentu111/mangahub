import { createContext, useContext, useState, ReactNode } from "react";
import { Chapter, NavigateDirection, Page } from "~/types";
interface ReadingContextType {
  currentChapter?: Chapter;
}
interface Props {
  children: ReactNode;
  value: ReadingContextType;
}
const settingContext = createContext<ReadingContextType | null>(null);
const SettingContextProvider = ({ children, value }: Props) => {
  return (
    <settingContext.Provider value={value}>{children}</settingContext.Provider>
  );
};

export default SettingContextProvider;
export const useSetting = () => useContext(settingContext);
