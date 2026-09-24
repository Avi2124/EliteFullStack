import { createRoot } from 'react-dom/client'
import "./styles/style.scss";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
