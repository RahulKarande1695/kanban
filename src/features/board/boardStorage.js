// Storage key madhe "v1" mhanje version. Pudhe state shape badalla tar "v2" karun
// jun data ignore karta yeto (ya migration karta yeto).
const STORAGE_KEY = 'kanban:board:v1'

// localStorage user manually edit karu shakto kinva jun format asu shakto.
// Mhanun load kelela data chi shape check karto, nahitar app crash hou shakto.
function isValidBoard(data) {
  return (
    data &&
    typeof data.columns === 'object' &&
    typeof data.cards === 'object' &&
    Array.isArray(data.columnOrder)
  )
}

// App start la ekda call hoto. Valid data milala tar return karto,
// nahitar undefined return karto (mhanje slice cha initialState vaprala jato).
export function loadBoard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined // pahilyanda app open kela, kahi saved nahi
    const parsed = JSON.parse(raw)
    return isValidBoard(parsed) ? parsed : undefined
  } catch {
    // JSON corrupt asel tar JSON.parse throw karto. Crash na karta empty board ne start karto.
    return undefined
  }
}

// Board state string madhe convert karun localStorage madhe save karto.
export function saveBoard(board) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  } catch (err) {
    // Storage full asel kinva private mode madhe blocked asel tar setItem throw karto.
    // App chalu rahila pahije, mhanun fakt log karto.
    console.error('Failed to save board', err)
  }
}