import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
  variant?: 'primary' | 'outline' | 'ghost'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, fullWidth, variant = 'primary', className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-primary text-white hover:bg-blue-700',
      outline: 'border border-primary text-primary hover:bg-blue-50',
      ghost: 'text-gray-600 hover:bg-gray-100',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
