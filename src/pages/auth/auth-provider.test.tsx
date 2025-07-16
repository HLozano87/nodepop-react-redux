import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from './auth-provider';
import { useAuth } from './context';

// Componente de prueba para acceder al contexto
const TestComponent = () => {
  const { isLogged, onLogin, onLogout } = useAuth();
  
  return (
    <div>
      <span data-testid="auth-status">
        {isLogged ? 'Logged In' : 'Logged Out'}
      </span>
      <button data-testid="login-button" onClick={onLogin}>
        Login
      </button>
      <button data-testid="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  describe('Estado inicial', () => {
    it('debe inicializar con isLogged = false cuando defaultIsLogged es false', () => {
      render(
        <AuthProvider defaultIsLogged={false}>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
    
    it('debe inicializar con isLogged = true cuando defaultIsLogged es true', () => {
      render(
        <AuthProvider defaultIsLogged={true}>
          <TestComponent />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });
  });
  
  describe('Funcionalidad de login', () => {
    it('debe cambiar isLogged a true cuando se llama onLogin', () => {
      render(
        <AuthProvider defaultIsLogged={false}>
          <TestComponent />
        </AuthProvider>
      );
      
      // Estado inicial
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Hacer login
      fireEvent.click(screen.getByTestId('login-button'));
      
      // Verificar cambio de estado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });
    
    it('debe mantener isLogged = true cuando se llama onLogin múltiples veces', () => {
      render(
        <AuthProvider defaultIsLogged={false}>
          <TestComponent />
        </AuthProvider>
      );
      
      // Hacer login múltiples veces
      fireEvent.click(screen.getByTestId('login-button'));
      fireEvent.click(screen.getByTestId('login-button'));
      fireEvent.click(screen.getByTestId('login-button'));
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });
  });
  
  describe('Funcionalidad de logout', () => {
    it('debe cambiar isLogged a false cuando se llama onLogout', () => {
      render(
        <AuthProvider defaultIsLogged={true}>
          <TestComponent />
        </AuthProvider>
      );
      
      // Estado inicial
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
      
      // Hacer logout
      fireEvent.click(screen.getByTestId('logout-button'));
      
      // Verificar cambio de estado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
    
    it('debe mantener isLogged = false cuando se llama onLogout múltiples veces', () => {
      render(
        <AuthProvider defaultIsLogged={true}>
          <TestComponent />
        </AuthProvider>
      );
      
      // Hacer logout múltiples veces
      fireEvent.click(screen.getByTestId('logout-button'));
      fireEvent.click(screen.getByTestId('logout-button'));
      fireEvent.click(screen.getByTestId('logout-button'));
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
  });
  
  describe('Flujo completo de autenticación', () => {
    it('debe permitir alternar entre login y logout', () => {
      render(
        <AuthProvider defaultIsLogged={false}>
          <TestComponent />
        </AuthProvider>
      );
      
      // Estado inicial: deslogueado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Login
      fireEvent.click(screen.getByTestId('login-button'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
      
      // Logout
      fireEvent.click(screen.getByTestId('logout-button'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Login nuevamente
      fireEvent.click(screen.getByTestId('login-button'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });
  });
  
  describe('Renderizado de children', () => {
    it('debe renderizar correctamente los children', () => {
      const TestChild = () => <div data-testid="test-child">Child Component</div>;
      
      render(
        <AuthProvider defaultIsLogged={false}>
          <TestChild />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toHaveTextContent('Child Component');
    });
  });
  
  describe('Comportamiento sin AuthProvider', () => {
    it('debe usar los valores por defecto cuando no hay AuthProvider', () => {
      render(<TestComponent />);
      
      // Verificar que use los valores por defecto del contexto
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Los botones deben estar presentes pero no harán nada útil
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });
    
    it('debe mantener los valores por defecto cuando se usan las funciones sin provider', () => {
      render(<TestComponent />);
      
      // Estado inicial
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Intentar hacer login (no debería cambiar nada porque son funciones vacías)
      fireEvent.click(screen.getByTestId('login-button'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      
      // Intentar hacer logout (no debería cambiar nada)
      fireEvent.click(screen.getByTestId('logout-button'));
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
  });
  
  describe('Optimización con useMemo', () => {
    it('debe proporcionar la misma referencia del objeto cuando isLogged no cambia', () => {
      let authValueRef1: any;
      let authValueRef2: any;
      
      const TestMemoComponent = () => {
        const authContext = useAuth();
        
        // Capturar referencias en diferentes renders
        if (!authValueRef1) {
          authValueRef1 = authContext;
        } else if (!authValueRef2) {
          authValueRef2 = authContext;
        }
        
        return (
          <div>
            <span data-testid="auth-status">
              {authContext.isLogged ? 'Logged In' : 'Logged Out'}
            </span>
            <button data-testid="force-render" onClick={() => {}}>
              Force Render
            </button>
          </div>
        );
      };
      
      const { rerender } = render(
        <AuthProvider defaultIsLogged={false}>
          <TestMemoComponent />
        </AuthProvider>
      );
      
      // Forzar un segundo render
      rerender(
        <AuthProvider defaultIsLogged={false}>
          <TestMemoComponent />
        </AuthProvider>
      );
      
      // Las referencias deben ser iguales si isLogged no cambió
      expect(authValueRef1).toBe(authValueRef2);
    });
  });
});