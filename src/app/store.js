import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../features/board/boardSlice'
import { loadBoard, saveBoard } from '../features/board/boardStorage'

// ---- LOAD: app start la localStorage madhun data vachto ----
// Ha code module load hotana ekda run hoto, store banvnyachya aadhi.
const savedBoard = loadBoard()

export const store = configureStore({
  reducer: {
    // "board" he store cha key aahe, mhanun state.board.columns asa access hoto.
    board: boardReducer,
  },

  // preloadedState = store cha initial state mhanun apan dilela data.
  // Saved data asel tar tech vapra, nasel tar preloadedState dyaycha nahi
  // (mhanje slice cha initialState vapra jail).
  // "...(savedBoard && {...})" mhanje savedBoard undefined asel tar kahi add hot nahi.
  ...(savedBoard && { preloadedState: { board: savedBoard } }),
})

// ---- SAVE: state badalla ki localStorage madhe write ----

// Debounce: function la lagechach call na karta, last call nantar `ms` wait karto.
// Wait madhe navin call aala tar timer reset hoto.
// Drag-and-drop madhe state khup veli badalto, tevha pratyek veli
// JSON.stringify + localStorage write nako, mhanun he vaparto.
function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// 300ms shanti zali ki fakt tevha latest board save hoil.
const persist = debounce(() => saveBoard(store.getState().board), 300)

// Mage save/check kelela board cha reference. Reference compare sathi lagto.
let previousBoard = store.getState().board

// store.subscribe: pratyek action dispatch zalyavar (state badalo va na badalo)
// he callback run hoto. Mhanun ithe filter karaych aahe.
store.subscribe(() => {
  const board = store.getState().board

  // Immer mule state khar tach badalla tar navin reference milto.
  // Board badalla nahi (dusrya slice cha action aala) tar save karaychi garaj nahi.
  if (board === previousBoard) return

  previousBoard = board
  persist() // debounced save
})

// Debounce chya 300ms madhe user ne tab band kela tar last change lost hoil.
// Mhanun page close hotana direct (debounce shivay) save karto.
// "pagehide" he "beforeunload" peksha mobile var jast reliable aahe.
window.addEventListener('pagehide', () => saveBoard(store.getState().board))