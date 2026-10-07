import { useRef, useState } from 'react'
import Input from '../atoms/Input'

// Text dakhavto. Click kelyavar input hoto.
// Enter / blur = save, Escape = cancel. (multiline madhe Shift+Enter = navi line)
export default function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit',
  multiline = false,
  allowEmpty = false, // title empty nasava, description empty chalel
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false)
  // draft = user type karat aahe te. Redux madhe fakt final value jate (Save var).
  // Typing UI state aahe, mhanun to Redux madhe nahi, component madhe thevla.
  const [draft, setDraft] = useState(value)
  const skipSave = useRef(false) // Escape nantar blur ne save hou naye mhanun

  const startEditing = () => {
    skipSave.current = false
    setDraft(value)
    setIsEditing(true)
  }

  const save = () => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    const trimmed = draft.trim()
    // Validation UI madhe (reducer simple thevla). Empty title asel tar jun value rahte.
    if ((trimmed || allowEmpty) && trimmed !== value) onSave(trimmed)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      skipSave.current = true
      setIsEditing(false)
    } else if (e.key === 'Enter' && !(multiline && e.shiftKey)) {
      e.preventDefault()
      save()
    }
  }

  if (isEditing) {
    return (
      <Input
        autoFocus
        multiline={multiline}
        className={className}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className={`editable ${value ? '' : 'editable--empty'} ${className}`}
      onClick={startEditing}
      onKeyDown={(e) => e.key === 'Enter' && startEditing()}
    >
      {value || placeholder}
    </span>
  )
}