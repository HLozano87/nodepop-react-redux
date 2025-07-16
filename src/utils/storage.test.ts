import { storage } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('get returns null if key does not exist', () => {
    expect(storage.get('auth')).toBeNull()
  })

  it('get returns stored value', () => {
    localStorage.setItem('auth', 'token123')
    expect(storage.get('auth')).toBe('token123')
  })

  it('set stores the value', () => {
    storage.set('auth', 'token456')
    expect(localStorage.getItem('auth')).toBe('token456')
  })

  it('remove deletes the key', () => {
    localStorage.setItem('auth', 'token789')
    storage.remove('auth')
    expect(localStorage.getItem('auth')).toBeNull()
  })

  it('clear removes all keys', () => {
    localStorage.setItem('auth', 'token')
    localStorage.setItem('other', 'value')
    storage.clear()
    expect(localStorage.getItem('auth')).toBeNull()
    expect(localStorage.getItem('other')).toBeNull()
  })
})