import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from "./button"

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies the correct variant class', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-secondary')
  })

  it('applies disabled classes and disables the button', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50')
    expect(button).not.toHaveClass('cursor-pointer')
  })

  it('applies cursor-pointer class when enabled', () => {
    render(<Button>Enabled</Button>)
    const button = screen.getByRole('button')
    expect(button).not.toBeDisabled()
    expect(button).toHaveClass('cursor-pointer')
    expect(button).not.toHaveClass('cursor-not-allowed')
  })

  it('calls onClick when clicked and not disabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('merges additional className prop', () => {
    render(
      <Button className="my-custom-class" variant="primary">
        Custom Class
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-primary')
    expect(button).toHaveClass('my-custom-class')
  })
})