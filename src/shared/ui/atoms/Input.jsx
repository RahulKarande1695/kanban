// multiline asel tar textarea, nahitar input. Baki sagle props (value, onChange...) pass hotat.
export default function Input({ multiline = false, className = '', ...props }) {
  const Tag = multiline ? 'textarea' : 'input'
  return <Tag className={`input ${className}`} {...props} />
}