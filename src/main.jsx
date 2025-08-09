import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PersonnageLocal from './coomposant/test.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonnageLocal />
  </StrictMode>,
)
