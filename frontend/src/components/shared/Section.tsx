import classNames from "classnames";
import Link from "next/link";
import { title } from "process";
import React, { ReactNode } from "react";
type Props = {
  title?: string;
  link?: string;
  children?: ReactNode;
  style?: string;
};

function Section({ children, link, title, style }: Props) {
  return (
    <section className={classNames("py-5", style)}>
      <div className={"flex flex-col "}>
        <div className="text-3xl font-bold text-red-500 mb-4">
          {title && (!link ? title : <Link href={link}>{title}</Link>)}
        </div>
        {children}
      </div>
    </section>
  );
}

export default Section;
