import Image from "next/image";
import {
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
// import { themeAtom } from "~/atoms";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLocalStorage } from "usehooks-ts";
import { useTheme } from "~/context/themeContext";
type Props = {};

const Header = (props: Props) => {
  const [theme, toggleTheme] = useTheme();
  const { data: session, status } = useSession();
  return (
    <header className=" backdrop-filter backdrop-blur-[20px] bg-slate-100/20 border-b-[1px] border-slate-700/20 z-50 fixed top-0 h-20  text-white w-full bg-white dark:bg-slate-900/75  dark:backdrop-blur-[20px]  transition duration-300">
      <div className=" md:max-w-[900px] lg:max-w-[1200px] m-auto flex h-full items-center px-6">
        <div className=" flex w-full">
          {/* logo */}
          <div className="flex items-center tracking-[5px] whitespace-nowrap font-bold md:text-3xl md:tracking-[7px] text-black dark:text-white">
            <Link href={"/"}>
              <h1>MANGA HUB</h1>
            </Link>
          </div>
          {/* left content */}
          <div className="ml-auto flex gap-3">
            <button className="button_t1 ">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <button
              className="button_t1 transition-all duration-200"
              onClick={() => toggleTheme()}
            >
              {theme === "light" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
            {session?.user ? (
              <div
                className="w-10 h-10 relative flex items-center cursor-pointer"
                onClick={() => signOut()}
              >
                <Image
                  unoptimized
                  src={session?.user?.image as string}
                  alt=""
                  fill
                  className="rounded-full"
                />
              </div>
            ) : (
              <Link href="/login" className="button_t1">
                <UserCircleIcon className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
