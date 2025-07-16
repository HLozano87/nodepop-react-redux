import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './login-page';
import { login } from './service';
import { storage } from '../../utils/storage';
import { useAuth } from './context';
import { useMessages } from '../../components/hooks/useMessage';

// Mocks
vi.mock('./service');
vi.mock('../../utils/storage');
vi.mock('./context');
vi.mock('../../components/hooks/useMessage');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.mocked(login);
const mockStorage = vi.mocked(storage);
const mockUseAuth = vi.mocked(useAuth);
const mockUseMessages = vi.mocked(useMessages);

// Mock implementations
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockOnLogin = vi.fn();
const mockOnLogout = vi.fn();

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseMessages.mockReturnValue({
      successMessage: 'Success message',
      errorMessage: 'Error message',
      showSuccess: mockShowSuccess,
      showError: mockShowError,
    });

    mockUseAuth.mockReturnValue({
      isLogged: false,
      onLogin: mockOnLogin,
      onLogout: mockOnLogout,
    });

    mockStorage.get.mockReturnValue(null);
    mockStorage.set.mockReturnValue(undefined);
    mockStorage.remove.mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      renderLoginPage();

      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /recuérdame/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByText(/¿no tienes cuenta\?/i)).toBeInTheDocument();
    });

    it('should have submit button disabled initially', () => {
      renderLoginPage();

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show password toggle button', () => {
      renderLoginPage();

      const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should enable submit button when email and password are filled', async () => {
      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
    });

    it('should keep submit button disabled when only email is filled', () => {
      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(submitButton).toBeDisabled();
    });

    it('should keep submit button disabled when only password is filled', () => {
      renderLoginPage();

      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(submitButton).toBeDisabled();
    });
  });

  describe('Password visibility toggle', () => {
    it('should toggle password visibility when clicking the eye button', () => {
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
    it('should call login service and navigate on successful login', async () => {
      mockLogin.mockResolvedValue('mock-token');

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          remember: false,
        });
      });

      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
        expect(mockShowSuccess).toHaveBeenCalledWith('¡Login exitoso!');
        expect(mockNavigate).toHaveBeenCalledWith('/adverts', { replace: true });
      });
    });

    it('should store auth token when remember me is checked', async () => {
      mockLogin.mockResolvedValue('mock-token');

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña');
      const rememberCheckbox = screen.getByRole('checkbox', { name: /recuérdame/i });
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(rememberCheckbox);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStorage.set).toHaveBeenCalledWith('auth', 'mock-token');
      });
    });

    it('should remove auth token when remember me is not checked', async () => {
      mockLogin.mockResolvedValue('mock-token');

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockStorage.remove).toHaveBeenCalledWith('auth');
      });
    });

    it('should show error message and clear fields on login failure', async () => {
      mockLogin.mockRejectedValue(new Error('Login failed'));

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Credenciales incorrectas.');
      });

      await waitFor(() => {
        expect(emailInput.value).toBe('');
        expect(passwordInput.value).toBe('');
      });
    });

    it('should show loading state during login', async () => {
      let resolveLogin: (value: string) => void;
      mockLogin.mockImplementation(() => 
        new Promise<string>((resolve) => {
          resolveLogin = resolve;
        })
      );

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña');
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Verificar estado de carga
      await waitFor(() => {
        expect(screen.getByText(/iniciando sesión\.\.\./i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });

      // Resolver la promesa
      resolveLogin!('mock-token');

      await waitFor(() => {
        expect(screen.queryByText(/iniciando sesión\.\.\./i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Saved credentials', () => {
    it('should load saved email from storage', () => {
      mockStorage.get.mockReturnValue(JSON.stringify({ email: 'saved@example.com' }));

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement;
      const rememberCheckbox = screen.getByRole('checkbox', { name: /recuérdame/i }) as HTMLInputElement;

      expect(emailInput.value).toBe('saved@example.com');
      expect(rememberCheckbox.checked).toBe(true);
    });

    it('should handle corrupted storage data gracefully', () => {
      mockStorage.get.mockReturnValue('invalid-json');
      vi.spyOn(console, 'error').mockImplementation(() => {});

      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i }) as HTMLInputElement;
      expect(emailInput.value).toBe('');
      expect(mockShowError).toHaveBeenCalled();
    });
  });

  describe('Form interactions', () => {
    it('should clear password when email changes', async () => {
      renderLoginPage();

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(passwordInput.value).toBe('password123');

      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

      await waitFor(() => {
        expect(passwordInput.value).toBe('');
      });
    });

    it('should update remember checkbox state', () => {
      renderLoginPage();

      const rememberCheckbox = screen.getByRole('checkbox', { name: /recuérdame/i }) as HTMLInputElement;

      expect(rememberCheckbox.checked).toBe(false);

      fireEvent.click(rememberCheckbox);

      expect(rememberCheckbox.checked).toBe(true);
    });
  });
});