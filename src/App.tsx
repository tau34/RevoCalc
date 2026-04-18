import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import './App.css'
import { TOOLS } from './types/ToolRegistry'
import { Dashboard } from './pages/Dashboard'
import { ToolPage } from './pages/ToolPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:toolId" element={<ToolPage tools={TOOLS} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}