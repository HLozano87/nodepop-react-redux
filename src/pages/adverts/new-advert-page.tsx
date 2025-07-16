import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../components/button";
import { createdAdvert, getAdvertTags } from "./services";
import { useMessages } from "../../components/hooks/useMessage";
import { Notifications } from "../../components/notifications";
import type { AdvertPayload } from "./type-advert";
import { useNavigate } from "react-router";

export const NewAdvertPage = () => {
  const [formData, setFormData] = useState<AdvertPayload>({
    name: "",
    price: 0,
    tags: [],
    sale: true,
    photo: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { successMessage, errorMessage, showSuccess, showError } = useMessages();
  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      const tags = await getAdvertTags();
      setTags(tags);
    };
    getTags();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.price > 0 &&
    selectedTags.length > 0 &&
    (formData.sale === true || formData.sale === false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload: AdvertPayload = {
        ...formData,
        tags: selectedTags,
      };

      // TODO mejor usar event.target.formData?
      const formDataToSend = new FormData();
      formDataToSend.append("name", payload.name);
      formDataToSend.append("price", String(payload.price));
      formDataToSend.append("sale", String(payload.sale));
      payload.tags.forEach((tag) => formDataToSend.append("tags", tag));
      if (photoFile) {
        formDataToSend.append("photo", photoFile);
      }

      const newAdvert = await createdAdvert(formDataToSend);

      showSuccess("¡Anuncio creado con éxito!");

      navigate(`/adverts/${newAdvert.id}`, { replace: true });

    } catch (error) {
      console.error("Something has gone wrong", error);
      showError("Ooops, algo ha salido mal...");
    }
  };

  const handleChange = ({
    target: { name, value, type, files },
  }: ChangeEvent<HTMLInputElement>) => {
    if (type === "file" && files) {
      setPhotoFile(files[0]);
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else if (name === "price") {
      const parsedPrice = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
      }));
    } else if (name === "sale") {
      setFormData((prev) => ({ ...prev, sale: value === "Compra" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="title">Crear Anuncio</h1>
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <Notifications
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
        <div>
          <label
            htmlFor="name"
            className="text-sm font-medium text-emerald-900"
          >
            Nombre <span className="required">*</span>
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-emerald-900">
            Precio <span className="required">*</span>
          </label>
          <input
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            type="number"
            name="price"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            required
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-emerald-900">
            Tags <span className="required">*</span>
          </label>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <label key={tag} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  className="peer hidden"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="inline-block rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition peer-checked:border-emerald-600 peer-checked:bg-emerald-100 peer-checked:text-emerald-700">
                  {tag}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-emerald-900">
            Tipo <span className="required">*</span>
          </label>
          <div className="mt-2 flex h-12 justify-around rounded-xl border border-gray-300 px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-600">
            <label
              htmlFor="compra"
              className="inline-flex items-center space-x-4"
            >
              <input
                type="radio"
                name="sale"
                id="compra"
                value="Compra"
                checked={formData.sale === true}
                onChange={handleChange}
                required
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="mb-1 rounded-full bg-emerald-100 px-3 text-[1rem] font-medium text-emerald-800">
                Compra
              </span>
            </label>

            <label
              htmlFor="venta"
              className="inline-flex items-center space-x-4"
            >
              <input
                type="radio"
                name="sale"
                id="venta"
                value="Venta"
                checked={formData.sale === false}
                onChange={handleChange}
                required
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="mb-1 rounded-full bg-blue-100 px-3 text-[1rem] font-medium text-blue-800">
                Venta
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 text-sm font-medium text-emerald-900">
            Foto (opcional)
          </label>
          <div className="mt-2">
            <label
              htmlFor="photo"
              className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-400 bg-gray-50 px-4 py-6 text-sm text-gray-600 transition hover:border-emerald-600 hover:bg-emerald-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 00.88 2.51A4 4 0 007 19h10a4 4 0 004-4 4 4 0 00-.88-2.51M15 10l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>
                {photoFile
                  ? `Imagen seleccionada: ${photoFile.name}`
                  : `Haz click para subir una imagen`}
              </span>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="mt-2 max-h-24 w-auto rounded-lg object-contain"
                />
              )}
              <input
                id="photo"
                name="photo"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="text-center">
          <Button type="submit" variant="primary" disabled={!isFormValid}>
            Publicar anuncio
          </Button>
        </div>
      </form>
    </div>
  );
};
