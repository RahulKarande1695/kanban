import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './app/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider store la sagalya child components sathi available karto,
        tyamule useSelector / useDispatch kuthe pan vaparta yetat. */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)