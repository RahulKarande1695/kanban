import { createSlice, nanoid } from '@reduxjs/toolkit'

// {
// columns: {
//   a1: { id: 'a1', title: 'Todo', cardIds: ['k1', 'k2'] },
//   b2: { id: 'b2', title: 'Done', cardIds: [] },
// },
// cards: {
//   k1: { id: 'k1', title: 'Setup Vite' },
//   k2: { id: 'k2', title: 'Write slice' },
// },
//   columnOrder: ['a1', 'b2', 'c3'],
// }

const initialState = {
  columns: {},
  cards: {},
  columnOrder: [],
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addColumn: {
      reducer(state, action) {
        const { id, title } = action.payload
        state.columns[id] = { id, title, cardIds: [] }
        state.columnOrder.push(id)
      },
    // prepare hi RTK chi ek special feature aahe. Ti action create hotana, reducer madhe jaanyaadhi, payload tayar karte.
      prepare(title) {
        return { payload: { id: nanoid(), title } }
      },
    },

    renameColumn(state, action) {
      const { columnId, title } = action.payload
      if (state.columns[columnId]) state.columns[columnId].title = title
    },

    deleteColumn(state, action) {
      const columnId = action.payload
      const column = state.columns[columnId]
      if (!column) return
      column.cardIds.forEach((cardId) => delete state.cards[cardId])
      delete state.columns[columnId]
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId)
    },

    addCard: {
      reducer(state, action) {
        const { id, columnId, title, description } = action.payload
        if (!state.columns[columnId]) return
        state.cards[id] = { id, title, description }
        state.columns[columnId].cardIds.push(id)
      },
      prepare({ columnId, title, description = '' }) {
        return { payload: { id: nanoid(), columnId, title, description } }
      },
    },

    editCard(state, action) {
      const { cardId, title, description } = action.payload
      const card = state.cards[cardId]
      if (!card) return
      if (title !== undefined) card.title = title
      if (description !== undefined) card.description = description
    },

    deleteCard(state, action) {
      const { cardId, columnId } = action.payload
      delete state.cards[cardId]
      const column = state.columns[columnId]
      if (column) column.cardIds = column.cardIds.filter((id) => id !== cardId)
    },

    // dnd-kit sathi (Step 5 madhe use karu)
    moveCard(state, action) {
      const { cardId, fromColumnId, toColumnId, toIndex } = action.payload
      const from = state.columns[fromColumnId]
      const to = state.columns[toColumnId]
      if (!from || !to) return
      from.cardIds = from.cardIds.filter((id) => id !== cardId)
      to.cardIds.splice(toIndex, 0, cardId)
    },
  },
})

export const {
  addColumn, renameColumn, deleteColumn,
  addCard, editCard, deleteCard, moveCard,
} = boardSlice.actions

export default boardSlice.reducer