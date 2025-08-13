import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './login-page';
import { storage } from '../../utils/storage';
import { useMessages } from '../../components/hooks/useMessage';
import { useLoginAction } from '../../store/auth/hooks';


// Mocks
vi.mock('../../utils/storage');
vi.mock('../../components/hooks/useMessage');
vi.mock('../../store/auth/hooks');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockStorage = vi.mocked(storage);
const mockUseMessages = vi.mocked(useMessages);
const mockUseLoginAction = vi.mocked(useLoginAction);

const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

const renderLoginPage = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

describe('LoginPage with Redux', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      successMessage: '',
      errorMessage: '',
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    mockStorage.set.mockReturnValue(undefined);
    mockStorage.remove.mockReturnValue(undefined);
  });

  describe('Rendering', () => {
    test('renders login form fields correctly', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /recuérdame/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    test('enables submit button when both email and password are filled', async () => {
      renderLoginPage();

      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await waitFor(() => expect(submitButton).toBeEnabled());
    });
  });

  describe('Password toggle', () => {
    test('toggles password visibility', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });

      expect(passwordInput.type).toBe('password');

      fireEvent.click(toggleButton);

      expect(passwordInput.type).toBe('text');
      expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    test('calls login action and navigates on success', async () => {
      const mockLogin = vi.fn().mockResolvedValue('mock-token');
      mockUseLoginAction.mockReturnValue(mockLogin);

      renderLoginPage();

      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          remember: false,
        });
        expect(mockShowSuccess).toHaveBeenCalledWith('¡Login exitoso!');
        expect(mockNavigate).toHaveBeenCalledWith('/adverts', { replace: true });
      });
    });

    test('stores token if remember me is checked', async () => {
      const mockLogin = vi.fn().mockResolvedValue('mock-token');
      mockUseLoginAction.mockReturnValue(mockLogin);

      renderLoginPage();

      fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('checkbox', { name: /recuérdame/i }));
      fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

      await waitFor(() => {
        expect(mockStorage.set).toHaveBeenCalledWith('auth', 'mock-token');
      });
    });
  });
});