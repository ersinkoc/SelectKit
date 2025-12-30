import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GettingStartedPage from './pages/GettingStartedPage'
import SelectPage from './pages/SelectPage'
import MultiSelectPage from './pages/MultiSelectPage'
import ComboboxPage from './pages/ComboboxPage'
import AsyncPage from './pages/AsyncPage'
import CreatablePage from './pages/CreatablePage'
import VirtualizationPage from './pages/VirtualizationPage'
import StylingPage from './pages/StylingPage'
import ApiPage from './pages/ApiPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="getting-started" element={<GettingStartedPage />} />
        <Route path="select" element={<SelectPage />} />
        <Route path="multi-select" element={<MultiSelectPage />} />
        <Route path="combobox" element={<ComboboxPage />} />
        <Route path="async" element={<AsyncPage />} />
        <Route path="creatable" element={<CreatablePage />} />
        <Route path="virtualization" element={<VirtualizationPage />} />
        <Route path="styling" element={<StylingPage />} />
        <Route path="api" element={<ApiPage />} />
      </Route>
    </Routes>
  )
}

export default App
