import { Page } from "../components/layout/page";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <Page title={'Error'}>
        <h2 className="mb-4 text-4xl font-bold text-red-600">404</h2>
        <p className="text-lg text-gray-700">Página no encontrada</p>
      </Page>
    </div>
  );
}