import { render, screen } from '@testing-library/react';
import { AuthContext, useAuth } from './context';

// Componente de prueba para testear useAuth
const TestComponent = () => {
  const { isLogged, onLogin, onLogout } = useAuth();
  
  return (
    <div>
      <span data-testid="auth-status">
        {isLogged ? 'Logged In' : 'Logged Out'}
      </span>
      <span data-testid="login-function">
        {typeof onLogin === 'function' ? 'Login Function Available' : 'No Login Function'}
      </span>
      <span data-testid="logout-function">
        {typeof onLogout === 'function' ? 'Logout Function Available' : 'No Logout Function'}
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

// Componente que proporciona valores personalizados al contexto
const CustomAuthProvider = ({ 
  children, 
  isLogged = false, 
  onLogin = () => {}, 
  onLogout = () => {} 
}: {
  children: React.ReactNode;
  isLogged?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}) => {
  const value = {
    isLogged,
    onLogin,
    onLogout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

describe('AuthContext', () => {
  describe('Valores por defecto', () => {
    it('debe proporcionar valores por defecto cuando no hay provider', () => {
      render(<TestComponent />);
      
      // Verificar valores por defecto
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
      expect(screen.getByTestId('login-function')).toHaveTextContent('Login Function Available');
      expect(screen.getByTestId('logout-function')).toHaveTextContent('Logout Function Available');
    });
    
    it('debe tener isLogged = false por defecto', () => {
      render(<TestComponent />);
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
    
    it('debe proporcionar funciones vacías por defecto', () => {
      render(<TestComponent />);
      
      // Las funciones deben estar disponibles
      expect(screen.getByTestId('login-function')).toHaveTextContent('Login Function Available');
      expect(screen.getByTestId('logout-function')).toHaveTextContent('Logout Function Available');
      
      // Los botones deben ser clickeables sin errores
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });
  });
  
  describe('Con provider personalizado', () => {
    it('debe usar los valores proporcionados por el provider', () => {
      render(
        <CustomAuthProvider isLogged={true}>
          <TestComponent />
        </CustomAuthProvider>
      );
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });
    
    it('debe usar isLogged = false cuando se proporciona explícitamente', () => {
      render(
        <CustomAuthProvider isLogged={false}>
          <TestComponent />
        </CustomAuthProvider>
      );
      
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
    
    it('debe usar las funciones personalizadas del provider', () => {
      let loginCalled = false;
      let logoutCalled = false;
      
      const customLogin = () => {
        loginCalled = true;
      };
      
      const customLogout = () => {
        logoutCalled = true;
      };
      
      render(
        <CustomAuthProvider 
          isLogged={false} 
          onLogin={customLogin} 
          onLogout={customLogout}
        >
          <TestComponent />
        </CustomAuthProvider>
      );
      
      // Verificar que las funciones personalizadas se ejecuten
      const loginButton = screen.getByTestId('login-button');
      const logoutButton = screen.getByTestId('logout-button');
      
      loginButton.click();
      expect(loginCalled).toBe(true);
      
      logoutButton.click();
      expect(logoutCalled).toBe(true);
    });
  });
});

describe('useAuth hook', () => {
  describe('Funcionalidad básica', () => {
    it('debe retornar el contexto completo', () => {
      const TestHookComponent = () => {
        const authContext = useAuth();
        
        return (
          <div>
            <span data-testid="has-islogged">
              {authContext.hasOwnProperty('isLogged') ? 'Has isLogged' : 'No isLogged'}
            </span>
            <span data-testid="has-onlogin">
              {authContext.hasOwnProperty('onLogin') ? 'Has onLogin' : 'No onLogin'}
            </span>
            <span data-testid="has-onlogout">
              {authContext.hasOwnProperty('onLogout') ? 'Has onLogout' : 'No onLogout'}
            </span>
            <span data-testid="islogged-type">
              {typeof authContext.isLogged}
            </span>
            <span data-testid="onlogin-type">
              {typeof authContext.onLogin}
            </span>
            <span data-testid="onlogout-type">
              {typeof authContext.onLogout}
            </span>
          </div>
        );
      };
      
      render(<TestHookComponent />);
      
      // Verificar que todas las propiedades estén presentes
      expect(screen.getByTestId('has-islogged')).toHaveTextContent('Has isLogged');
      expect(screen.getByTestId('has-onlogin')).toHaveTextContent('Has onLogin');
      expect(screen.getByTestId('has-onlogout')).toHaveTextContent('Has onLogout');
      
      // Verificar tipos
      expect(screen.getByTestId('islogged-type')).toHaveTextContent('boolean');
      expect(screen.getByTestId('onlogin-type')).toHaveTextContent('function');
      expect(screen.getByTestId('onlogout-type')).toHaveTextContent('function');
    });
    
    it('debe ser consistente en múltiples llamadas', () => {
      const TestConsistencyComponent = () => {
        const auth1 = useAuth();
        const auth2 = useAuth();
        
        return (
          <div>
            <span data-testid="same-islogged">
              {auth1.isLogged === auth2.isLogged ? 'Same isLogged' : 'Different isLogged'}
            </span>
            <span data-testid="same-onlogin">
              {auth1.onLogin === auth2.onLogin ? 'Same onLogin' : 'Different onLogin'}
            </span>
            <span data-testid="same-onlogout">
              {auth1.onLogout === auth2.onLogout ? 'Same onLogout' : 'Different onLogout'}
            </span>
          </div>
        );
      };
      
      render(<TestConsistencyComponent />);
      
      // Verificar que las referencias sean las mismas
      expect(screen.getByTestId('same-islogged')).toHaveTextContent('Same isLogged');
      expect(screen.getByTestId('same-onlogin')).toHaveTextContent('Same onLogin');
      expect(screen.getByTestId('same-onlogout')).toHaveTextContent('Same onLogout');
    });
  });
  
  describe('Con diferentes providers', () => {
    it('debe retornar diferentes valores según el provider', () => {
      const TestMultipleProviders = () => {
        return (
          <div>
            <CustomAuthProvider isLogged={true}>
              <div data-testid="provider1">
                <TestComponent />
              </div>
            </CustomAuthProvider>
            
            <CustomAuthProvider isLogged={false}>
              <div data-testid="provider2">
                <TestComponent />
              </div>
            </CustomAuthProvider>
          </div>
        );
      };
      
      render(<TestMultipleProviders />);
      
      // Verificar que cada provider tenga sus propios valores
      const provider1Status = screen.getAllByTestId('auth-status')[0];
      const provider2Status = screen.getAllByTestId('auth-status')[1];
      
      expect(provider1Status).toHaveTextContent('Logged In');
      expect(provider2Status).toHaveTextContent('Logged Out');
    });
  });
  
  describe('Integración con componentes', () => {
    it('debe funcionar correctamente en componentes anidados', () => {
      const NestedComponent = () => {
        const { isLogged } = useAuth();
        return (
          <div data-testid="nested-status">
            {isLogged ? 'Nested Logged In' : 'Nested Logged Out'}
          </div>
        );
      };
      
      const ParentComponent = () => {
        const { isLogged } = useAuth();
        return (
          <div>
            <div data-testid="parent-status">
              {isLogged ? 'Parent Logged In' : 'Parent Logged Out'}
            </div>
            <NestedComponent />
          </div>
        );
      };
      
      render(
        <CustomAuthProvider isLogged={true}>
          <ParentComponent />
        </CustomAuthProvider>
      );
      
      // Ambos componentes deben tener el mismo estado
      expect(screen.getByTestId('parent-status')).toHaveTextContent('Parent Logged In');
      expect(screen.getByTestId('nested-status')).toHaveTextContent('Nested Logged In');
    });
  });
});