import { Outlet } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-grow items-center justify-center px-6 py-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};
