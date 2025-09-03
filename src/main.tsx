import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { checkDatabaseConsistency } from './utils/devDatabaseCheck'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)


checkDatabaseConsistency().catch(console.warn)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
