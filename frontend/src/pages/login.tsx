import React, { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import MainLayout from "~/components/layout/MainLayout";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="h-screen flex items-center">
      <div
        className="w-full h-[600px] py-20 px-3 m-auto sm:w-[400px] border-2 text-center
         flex flex-col justify-center gap-[60px]
      "
      >
        <span className="text-4xl text-black dark:text-white font-primary uppercase tracking-[5px]">
          MANGA HUB
        </span>
        <div
          className="bg-gray-400 dark:bg-white rounded-lg p-2 flex items-center justify-evenly cursor-pointer
         max-w-[400px] space-x-5 mx-auto transition duration-200 hover:scale-110"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <FcGoogle className="w-6 h-6 " />
          <span className="text-lg">Đăng nhập với Google</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
LoginPage.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;
