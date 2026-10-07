import { useDispatch, useSelector } from 'react-redux'
import { addCard, deleteColumn, renameColumn } from '../boardSlice'
import { selectColumnById } from '../boardSelectors'
import Button from '../../../shared/ui/atoms/Button'
import EditableText from '../../../shared/ui/molecules/EditableText'
import InlineAddForm from '../../../shared/ui/molecules/InlineAddForm'
import Card from './Card'

export default function Column({ columnId }) {
  const dispatch = useDispatch()
  const column = useSelector((state) => selectColumnById(state, columnId))

  if (!column) return null // stale props guard (Card sarkhach)

  const handleDelete = () => {
    const count = column.cardIds.length
    // Cards asतील tar confirm vichara, karan deleteColumn cards pan delete karto.
    if (count > 0 && !window.confirm(`Delete "${column.title}" and its ${count} card(s)?`)) return
    dispatch(deleteColumn(columnId))
  }

  return (
    <section className="column">
      <header className="column__header">
        <EditableText
          className="column__title"
          value={column.title}
          onSave={(title) => dispatch(renameColumn({ columnId, title }))}
        />
        <Button variant="icon" aria-label="Delete column" onClick={handleDelete}>
          🗑
        </Button>
      </header>

      <ul className="column__cards">
        {column.cardIds.map((cardId) => (
          <Card key={cardId} cardId={cardId} columnId={columnId} />
        ))}
      </ul>

      <InlineAddForm
        triggerLabel="+ Add card"
        placeholder="Card title"
        submitLabel="Add card"
        onSubmit={(title) => dispatch(addCard({ columnId, title }))}
      />
    </section>
  )
}