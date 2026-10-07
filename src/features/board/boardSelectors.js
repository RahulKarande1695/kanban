// Selectors mule components la state shape (state.board.columns...) mahit asaychi garaj nahi.
// Shape badalla tar fakt hi file badalaychi.
export const selectColumnOrder = (state) => state.board.columnOrder
export const selectColumnById = (state, columnId) => state.board.columns[columnId]
export const selectCardById = (state, cardId) => state.board.cards[cardId]