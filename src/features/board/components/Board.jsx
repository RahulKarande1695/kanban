import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addColumn } from '../boardSlice'
import { selectColumnOrder } from '../boardSelectors'
import InlineAddForm from '../../../shared/ui/molecules/InlineAddForm'
import Column from './Column'

export default function Board() {
  const dispatch = useDispatch()
  const columnOrder = useSelector(selectColumnOrder)

  // Drag UI state: konta card drag hotay ({ cardId, columnId }) kinva null.
  // He Redux madhe nahi, karan te fakt tatpurte UI sathi aahe, save karaychi garaj nahi.
  const [dragging, setDragging] = useState(null)

  return (
    <main className="board">
      {columnOrder.map((columnId) => (
        <Column
          key={columnId}
          columnId={columnId}
          dragging={dragging}
          onDragStart={setDragging}
          onDragEnd={() => setDragging(null)}
        />
      ))}
      <div className="board__add">
        <InlineAddForm
          triggerLabel="+ Add column"
          placeholder="Column title"
          submitLabel="Add column"
          onSubmit={(title) => dispatch(addColumn(title))}
        />
      </div>
    </main>
  )
}