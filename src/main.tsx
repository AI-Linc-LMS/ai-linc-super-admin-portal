import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { OrganizationsProvider } from './state/organizations'
import { CourseMatrixProvider } from './state/courseMatrix'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OrganizationsProvider>
        <CourseMatrixProvider>
          <App />
        </CourseMatrixProvider>
      </OrganizationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
