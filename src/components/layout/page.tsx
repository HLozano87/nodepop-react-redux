import type { ReactNode } from "react";

interface PagePros {
  title: string;
  children: ReactNode;
}

export const Page = ({ title, children }: PagePros) => {
  return (
    <>
      <h1 className="title">
        {title}
      </h1>
      {children}
    </>
  );
};
