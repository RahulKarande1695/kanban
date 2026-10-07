import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCard, deleteColumn, moveCard, renameColumn } from '../boardSlice'
import { selectColumnById } from '../boardSelectors'
import Button from '../../../shared/ui/atoms/Button'
import EditableText from '../../../shared/ui/molecules/EditableText'
import InlineAddForm from '../../../shared/ui/molecules/InlineAddForm'
import Card from './Card'

export default function Column({ columnId, dragging, onDragStart, onDragEnd }) {
  const dispatch = useDispatch()
  const column = useSelector((state) => selectColumnById(state, columnId))
  const listRef = useRef(null)

  // dropIndex = ya column madhe card kuthe padel (null = kahi nahi / ha column target nahi)
  const [dropIndex, setDropIndex] = useState(null)

  // Drag sampla (drop kinva Escape) ki indicator clear kara, nahitar pudhchya drag la stale dista.
  useEffect(() => {
    if (!dragging) setDropIndex(null)
  }, [dragging])

  if (!column) return null

  // Drag hotana dragged card cha DOM element vegla (card--dragging) aahe, tyala count madhun vagla.
  // Mouse Y ani baki cards chya midpoint chi tulna karun insert index thharavto.
  const getDropIndex = (clientY) => {
    const items = [...listRef.current.querySelectorAll('.card:not(.card--dragging)')]
    const index = items.findIndex((el) => {
      const rect = el.getBoundingClientRect()
      return clientY < rect.top + rect.height / 2
    })
    return index === -1 ? items.length : index // -1 = sarvaat khali
  }

  const handleDragOver = (e) => {
    if (!dragging) return // card nahi, dusra kahi (file, text) drag hotay, ignore
    // preventDefault kele tarach browser ya element la valid drop target manto.
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropIndex(getDropIndex(e.clientY))
  }

  // Child element var gelyavar pan dragleave fire hoto (flicker cha karan).
  // Mhanun fakt tevha clear kara jevha mouse khar tach column baher gela.
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDropIndex(null)
  }

  const handleDrop = (e) => {
    if (!dragging) return
    e.preventDefault()
    const toIndex = getDropIndex(e.clientY)
    const sameSpot =
      dragging.columnId === columnId && column.cardIds.indexOf(dragging.cardId) === toIndex

    // Same jagi sodla tar state badlaychi garaj nahi.
    if (!sameSpot) {
      dispatch(moveCard({
        cardId: dragging.cardId,
        fromColumnId: dragging.columnId,
        toColumnId: columnId,
        toIndex,
      }))
    }
    setDropIndex(null)
    // dragend event source card var fire hoto, pan card dusrya column madhe gela tar
    // original element unmount hoto ani dragend yet nahi. Mhanun ithech clear karto.
    onDragEnd()
  }

  const handleDelete = () => {
    const count = column.cardIds.length
    if (count > 0 && !window.confirm(`Delete "${column.title}" and its ${count} card(s)?`)) return
    dispatch(deleteColumn(columnId))
  }

  // Indicator sathi: dragged card vagla list, ani tyat dropIndex var konta card ahe.
  const visibleIds = dragging
    ? column.cardIds.filter((id) => id !== dragging.cardId)
    : column.cardIds
  const targetId = dropIndex !== null ? visibleIds[dropIndex] : undefined
  const showEndIndicator = dropIndex !== null && dropIndex === visibleIds.length

  return (
    <section
      className="column"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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

      <ul className="column__cards" ref={listRef}>
        {column.cardIds.map((cardId) => (
          <Card
            key={cardId}
            cardId={cardId}
            columnId={columnId}
            isDragging={dragging?.cardId === cardId}
            showDropBefore={cardId === targetId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {showEndIndicator && <li className="drop-indicator" />}
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