import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { useMessages } from "../../components/hooks/useMessage";
import { Notifications } from "../../components/ui/notification";
import type { AdvertPayload } from "./type-advert";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/formFields";
import { Page } from "../../components/layout/page";
import { Form } from "../../components/ui/form";
import { useAppDispatch, useAppSelector, type RootState } from "../../store";
import { advertsCreated, advertsTagsLoaded } from "../../store/adverts/actions";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { successMessage, errorMessage, showSuccess, showError } =
    useMessages();
  const tags = useAppSelector((state: RootState) => state.adverts.tags);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(advertsTagsLoaded());
  }, [dispatch]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.price > 0 &&
    selectedTags.length > 0 &&
    typeof formData.sale === "boolean";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData(event.currentTarget);
      const newAdvert = await dispatch(advertsCreated(formDataToSend));

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
      setFormData((prev) => ({ ...prev, sale: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <main className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">
      <Page title={"Crear Anuncio"}>
        <Form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
          method="POST"
        >
          <Notifications
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
          <Input
            label="Nombre"
            labelClassName="label-newAdvert"
            id="name"
            name="name"
            type="text"
            className="newAdvertInputs"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Precio"
            labelClassName="label-newAdvert"
            id="price"
            name="price"
            type="number"
            className="newAdvertInputs"
            min="1"
            step="0.01"
            value={formData.price}
            required
            onChange={handleChange}
          />

          <div>
            <label className="mb-1 text-sm font-medium text-emerald-900">
              Tags <span className="required">*</span>
            </label>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <label key={tag} className="cursor-pointer">
                  {/* WIP TODO component created problem to peer hidden */}
                  <input
                    id={`tag-${tag}`}
                    name="tags"
                    type="checkbox"
                    className="peer hidden"
                    value={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  <span className="newAdvertTags">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="mb-1 text-sm font-medium text-emerald-900">
            Tipo <span className="required">*</span>
          </label>
          <div className="newAdvertTypes">
            <label
              htmlFor="compra"
              className="inline-flex items-center space-x-4"
            >
              <Input
                id="compra"
                name="sale"
                type="radio"
                className="rounded text-blue-500 focus:ring-blue-500"
                value="true"
                checked={formData.sale === true}
                onChange={handleChange}
                required
              />
              <span className="mb-1 rounded-full bg-emerald-100 px-3 text-[1rem] font-medium text-emerald-800">
                Compra
              </span>
            </label>

            <label
              htmlFor="venta"
              className="inline-flex items-center space-x-4"
            >
              <Input
                id="venta"
                name="sale"
                type="radio"
                className="rounded text-blue-500 focus:ring-blue-500"
                value="false"
                checked={formData.sale === false}
                onChange={handleChange}
                required
              />
              <span className="mb-1 rounded-full bg-blue-100 px-3 text-[1rem] font-medium text-blue-800">
                Venta
              </span>
            </label>
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
                <Input
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
        </Form>
      </Page>
    </main>
  );
};
