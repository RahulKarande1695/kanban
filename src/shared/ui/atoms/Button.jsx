// variant: 'primary' | 'ghost' | 'icon' (CSS madhe style aahe)
export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`btn btn--${variant} ${className}`} {...props} />
}