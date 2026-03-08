import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { HomePage } from './pages/HomePage'
import { DevPage } from './dev/DevPage'
import { TranslatePage } from './pages/TranslatePage/TranslatePage'
import { AboutPage } from './pages/AboutUsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { MyFilesPage } from './pages/MyFilesPage'
import { ErrorBoundary } from './components/common/ErrorBoundary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <DevPage />
      }
    ]
  },
  {
    path: '/translate',
    errorElement: <ErrorBoundary />,
    element: <App />,
    children: [
      {
        index: true,
        element: <TranslatePage />
      }
    ]
  },
  {
    path: '/my-files',
    errorElement: <ErrorBoundary />,
    element: <App />,
    children: [
      {
        index: true,
        element: <MyFilesPage />
      }
    ]
  },
  {
    path: '/about',
    errorElement: <ErrorBoundary />,
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
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <NotFoundPage />
      }
    ]
  }
])
