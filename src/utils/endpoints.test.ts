import { USER_ENDPOINTS, ADVERT_ENDPOINT } from './endpoints'

describe('USER_ENDPOINTS', () => {
  it('should have correct signup endpoint', () => {
    expect(USER_ENDPOINTS.SIGNUP).toBe('/api/auth/signup')
  })
  it('should have correct login endpoint', () => {
    expect(USER_ENDPOINTS.LOGIN).toBe('/api/auth/login')
  })
  it('should have correct auth endpoint', () => {
    expect(USER_ENDPOINTS.AUTH).toBe('/api/auth/me')
  })
})

describe('ADVERT_ENDPOINT', () => {
  it('should have correct tags endpoint', () => {
    expect(ADVERT_ENDPOINT.TAGS).toBe('/api/v1/adverts/tags')
  })
  it('should have correct adverts endpoint', () => {
    expect(ADVERT_ENDPOINT.ADVERT).toBe('/api/v1/adverts')
  })
  it('should return correct advert by id endpoint', () => {
    expect(ADVERT_ENDPOINT.ADVERT_ID('123')).toBe('/api/v1/adverts/123')
  })
})