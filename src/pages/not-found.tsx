import { Link } from "react-router-dom";
import { Page } from "../components/layout/page";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <Page title={"Oooops, por aqui no hay nada!"}>
        <h2 className="mb-4 text-4xl font-bold text-red-600">404</h2>
        <p className="text-lg text-gray-700">Página no encontrada</p>

        <div className="mt-10">
          <Link
            to="/"
            className="group mt-4 inline-flex items-center gap-2 no-underline"
          >
            <span className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1">
              ⬅️
            </span>
            <span className="text-[1em] font-bold transition-colors duration-300 ease-in-out group-hover:text-green-800">
              Volver al inicio
            </span>
          </Link>
        </div>
      </Page>
    </div>
  );
}
