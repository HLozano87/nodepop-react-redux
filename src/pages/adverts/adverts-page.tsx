import { useEffect, useState } from "react";
import type { Advert } from "./type-advert";
import { getAdvertsList } from "./services";
import { Button } from "../../components/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context";
import {
  FilterClosedIcon,
  FilterOpenIcon,
} from "../../components/icons/filters";

const EmptyAdverts = () => {
  return (
    <div className="empty-adverts-page">
      <p>Ningún anuncio que mostrar.</p>
      <Link to={"/adverts/new"}>
        <Button variant="primary" type="button">
          Crear anuncio
        </Button>
      </Link>
    </div>
  );
};

export const AdvertsPage = () => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [typeSaleFilter, setTypeSaleFilter] = useState(""); // "buy" | "sell" | ""
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login", { replace: true });
    }
    async function getAdverts() {
      const advert = await getAdvertsList();
      setAdverts(advert);
    }
    getAdverts();
  }, [isLogged, navigate]);

  const filteredAdverts = adverts.filter((advert) => {
    const matchesName = advert.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());

    const matchesType =
      typeSaleFilter === "" ||
      (typeSaleFilter === "sell" && !advert.sale) ||
      (typeSaleFilter === "buy" && advert.sale);

    const matchesMinPrice =
      priceMin === "" || advert.price >= parseFloat(priceMin);
    const matchesMaxPrice =
      priceMax === "" || advert.price <= parseFloat(priceMax);

    const matchesTags =
      tagFilter.length === 0 ||
      tagFilter.every((tag) => advert.tags.includes(tag));

    return (
      matchesName &&
      matchesType &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesTags
    );
  });

  const uniqueTags = [
    ...new Set(adverts.flatMap((filterAdvert) => filterAdvert.tags)),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className={"title"}>Bienvenido a Nodepop</h1>
      <p className="py-1 text-center text-sm text-gray-600">
        Página de nuncios
      </p>
      <div className="mb-4 text-right">
        <Button
          onClick={() => setShowFilters((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 p-2 text-white shadow transition hover:bg-emerald-700"
          title={showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        >
          {showFilters ? <FilterOpenIcon /> : <FilterClosedIcon />}
        </Button>
      </div>

      {showFilters && (
        <form
          onSubmit={(event) => {
            event.preventDefault();

          }}
          className="animate-fadeIn mb-8 rounded-xl bg-gray-100 p-4 shadow-inner"
        >
          <h2 className="mb-2 text-center text-xl font-medium text-emerald-900">
            Filtros
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="nameFilter"
              >
                Nombre
              </label>
              <input
                id="nameFilter"
                type="text"
                placeholder="Buscar por nombre"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="typeSaleFilter"
              >
                Tipo de anuncio
              </label>
              <select
                id="typeSaleFilter"
                value={typeSaleFilter}
                onChange={(event) => setTypeSaleFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="sell">Venta</option>
                <option value="buy">Compra</option>
              </select>
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="priceMin"
              >
                Precio mínimo (€)
              </label>
              <input
                id="priceMin"
                type="number"
                min="0"
                value={priceMin}
                onChange={(event) => setPriceMin(event.target.value)}
                placeholder="Mínimo"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium text-gray-700"
                htmlFor="priceMax"
              >
                Precio máximo (€)
              </label>
              <input
                id="priceMax"
                type="number"
                min="0"
                value={priceMax}
                onChange={(event) => setPriceMax(event.target.value)}
                placeholder="Máximo"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filtro por tags múltiples */}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 text-center">
                Tags
              </label>
              <div className="flex flex-wrap gap-3 justify-center">
                {uniqueTags.map((tag) => (
                  <label
                    key={tag}
                    className={"inline-flex items-center space-x-2"}
                  >
                    <input
                      type="checkbox"
                      value={tag}
                      checked={tagFilter.includes(tag)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setTagFilter([...tagFilter, tag]);
                        } else {
                          setTagFilter(tagFilter.filter((t) => t !== tag));
                        }
                      }}
                      className="accent-emerald-600"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-right">
            <Button type="submit" variant="primary">
              Aplicar filtros
            </Button>
          </div>
        </form>
      )}

      {/* Lista de anuncios */}
      {filteredAdverts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredAdverts.map((advert) => (
            <li key={advert.id}>
              <div className="flex flex-col space-y-3 rounded-2xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                <Link to={`/adverts/${advert.id}`}>
                  <h3 className="text-center text-lg font-semibold text-emerald-800">
                    {advert.name}
                  </h3>
                </Link>
                <Link to={`/adverts/${advert.id}`}>
                  <img
                    src={advert.photo || "/no-fotos.png"}
                    alt={advert.name || "Sin imagen"}
                    className="mb-4 h-48 w-full rounded-lg object-contain"
                  />
                </Link>
                <p className="py-1 text-center text-sm text-gray-600">
                  {advert.tags.join(", ")}
                </p>
                <p className="text-center font-bold text-emerald-900">
                  {advert.price} €
                </p>
                <span
                  className={`mx-auto inline-flex items-center justify-center rounded-full px-6 py-1 text-xs font-medium shadow-lg ${
                    advert.sale
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {advert.sale ? "Compra" : "Venta"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyAdverts />
      )}
    </div>
  );
};
