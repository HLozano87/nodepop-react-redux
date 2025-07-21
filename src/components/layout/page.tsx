import type { ReactNode } from "react";

interface PagePros {
  title: string;
  children: ReactNode;
}

export const Page = ({ title, children }: PagePros) => {
  return (
    <main className="px-4 py-8 mx-auto max-w-6xl">
      <h1 className="title">
        {title}
      </h1>
      {children}
    </main>
  );
};
