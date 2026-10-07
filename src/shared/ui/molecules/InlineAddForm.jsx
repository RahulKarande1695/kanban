import { useState } from 'react'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

// "+ Add card" button. Click kelyavar input + Add/Cancel dakhavto.
// Column ani card donhi add sathi vaparla jato.
export default function InlineAddForm({ triggerLabel, placeholder, submitLabel = 'Add', onSubmit }) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')

  const close = () => {
    setText('')
    setIsOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return // empty validation UI madhe
    onSubmit(trimmed)
    setText('') // form open thevla, pudhcha card pataapat add karta yava
  }

  if (!isOpen) {
    return (
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        {triggerLabel}
      </Button>
    )
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <Input
        autoFocus
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      />
      <div className="inline-form__actions">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
      </div>
    </form>
  )
}