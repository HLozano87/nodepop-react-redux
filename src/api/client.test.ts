import { apiClient, setAuthorizationHeader, removeAuthorizationHeader } from './client'

describe('apiClient', () => {
  beforeEach(() => {
    // Limpia el localStorage antes de cada test
    localStorage.clear()
  })

  test('should add Authorization header from localStorage in interceptor', async () => {
    // Arrange
    localStorage.setItem('auth', 'FAKE_TOKEN')

    // Mock the adapter to capture the config
    const mockAdapter = vi.fn(config => Promise.resolve({ config, status: 200, data: {}, statusText: 'OK', headers: {} }));
    apiClient.defaults.adapter = mockAdapter;

    // Act
    await apiClient.get('/test');

    // Assert
    expect(mockAdapter).toHaveBeenCalled();
    const calledConfig = mockAdapter.mock.calls[0][0];
    expect(calledConfig.headers?.Authorization).toBe('Bearer FAKE_TOKEN');
  });

  test('should not add Authorization header if no token', async () => {
    // localStorage está vacío

    // Mock the adapter to capture the config
    const mockAdapter = vi.fn(config => Promise.resolve({ config, status: 200, data: {}, statusText: 'OK', headers: {} }));
    apiClient.defaults.adapter = mockAdapter;

    await apiClient.get('/test');

    expect(mockAdapter).toHaveBeenCalled();
    const calledConfig = mockAdapter.mock.calls[0][0];
    expect(calledConfig.headers?.Authorization).toBeUndefined();
  })

  test('should set Authorization header globally', () => {
    setAuthorizationHeader('MY_TOKEN')
    expect(apiClient.defaults.headers.common['Authorization']).toBe('Bearer MY_TOKEN')
  })

  test('should remove Authorization header globally', () => {
    setAuthorizationHeader('MY_TOKEN')
    removeAuthorizationHeader()
    expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined()
  })
})