import { USER_ENDPOINTS, ADVERT_ENDPOINT } from './endpoints'

describe('USER_ENDPOINTS', () => {
  test('should have correct signup endpoint', () => {
    expect(USER_ENDPOINTS.SIGNUP).toBe('/api/auth/signup')
  })
  test('should have correct login endpoint', () => {
    expect(USER_ENDPOINTS.LOGIN).toBe('/api/auth/login')
  })
  test('should have correct auth endpoint', () => {
    expect(USER_ENDPOINTS.AUTH).toBe('/api/auth/me')
  })
})

describe('ADVERT_ENDPOINT', () => {
  test('should have correct tags endpoint', () => {
    expect(ADVERT_ENDPOINT.TAGS).toBe('/api/v1/adverts/tags')
  })
  test('should have correct adverts endpoint', () => {
    expect(ADVERT_ENDPOINT.ADVERT).toBe('/api/v1/adverts')
  })
  test('should return correct advert by id endpoint', () => {
    expect(ADVERT_ENDPOINT.ADVERT_ID('123')).toBe('/api/v1/adverts/123')
  })
})