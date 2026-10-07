import { useDispatch, useSelector } from 'react-redux'
import { addColumn } from '../boardSlice'
import { selectColumnOrder } from '../boardSelectors'
import InlineAddForm from '../../../shared/ui/molecules/InlineAddForm'
import Column from './Column'

export default function Board() {
  const dispatch = useDispatch()
  // columnOrder varun render hoto, mhanun columns chi sequence barobar rahte.
  const columnOrder = useSelector(selectColumnOrder)

  return (
    <main className="board">
      {columnOrder.map((columnId) => (
        <Column key={columnId} columnId={columnId} />
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