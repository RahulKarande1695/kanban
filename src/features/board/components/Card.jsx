import { useDispatch, useSelector } from 'react-redux'
import { deleteCard, editCard } from '../boardSlice'
import { selectCardById } from '../boardSelectors'
import Button from '../../../shared/ui/atoms/Button'
import EditableText from '../../../shared/ui/molecules/EditableText'

// Card fakt cardId gheto, ani data swata store madhun vachto.
// Mhanun ek card badalla tar fakt tyach card cha component re-render hoto.
export default function Card({ cardId, columnId }) {
  const dispatch = useDispatch()
  const card = useSelector((state) => selectCardById(state, cardId))

  // Parent delete zalyavar child kahi veli stale props sobat ekda render hoto,
  // tevha card undefined aaso shakto. Mhanun guard.
  if (!card) return null

  return (
    <li className="card">
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