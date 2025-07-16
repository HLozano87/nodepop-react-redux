import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found';

describe('<NotFoundPage />', () => {
  it('muestra el título 404 y el mensaje de página no encontrada', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
