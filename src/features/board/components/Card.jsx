import { useDispatch, useSelector } from 'react-redux'
import { deleteCard, editCard } from '../boardSlice'
import { selectCardById } from '../boardSelectors'
import Button from '../../../shared/ui/atoms/Button'
import EditableText from '../../../shared/ui/molecules/EditableText'

export default function Card({ cardId, columnId, isDragging, showDropBefore, onDragStart, onDragEnd }) {
  const dispatch = useDispatch()
  const card = useSelector((state) => selectCardById(state, cardId))

  if (!card) return null

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    // Firefox madhe setData kelyashivay drag suru hot nahi, mhanun he compulsory.
    e.dataTransfer.setData('text/plain', cardId)
    onDragStart({ cardId, columnId })
  }

  return (
    <li
      className={[
        'card',
        isDragging && 'card--dragging', // original card dhusar disto
        showDropBefore && 'card--drop-before', // ya card chya var indicator line
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="card__header">
        <EditableText
          className="card__title"
          value={card.title}
          onSave={(title) => dispatch(editCard({ cardId, title }))}
        />
        <Button
          variant="icon"
          aria-label="Delete card"
          onClick={() => dispatch(deleteCard({ cardId, columnId }))}
        >
          ×
        </Button>
      </div>
      <EditableText
        multiline
        allowEmpty
        placeholder="Add description"
        className="card__description"
        value={card.description}
        onSave={(description) => dispatch(editCard({ cardId, description }))}
      />
    </li>
  )
}