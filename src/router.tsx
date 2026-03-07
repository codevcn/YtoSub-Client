import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { HomePage } from './pages/HomePage'
import { DevPage } from './dev/DevPage'
import { TranslatePage } from './pages/TranslatePage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  },
  {
    path: '/dev',
    element: <App />,
    children: [
      {
        index: true,
        element: <DevPage />
      }
    ]
  },
  {
    path: '/translate',
    element: <App />,
    children: [
      {
        index: true,
        element: <TranslatePage />
      }
    ]
  },
  {
    path: '/about',
    element: <App />,
    children: [
      {
        index: true,
        element: <AboutPage />
      }
    ]
  },
  {
    path: '*',
    element: <App />,
    children: [
      {
        index: true,
        element: <NotFoundPage />
      }
    ]
  }
])
