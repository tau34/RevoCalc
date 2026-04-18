import { useState } from "react"
import { Link } from "react-router-dom"
import { TOOLS } from "../types/ToolRegistry"

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="header">
        <div className={`hamburger-menu ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <h3 className={`title ${open ? 'active' : ''}`}>
          Revolution Idle Calculators
        </h3>
      </div>

      {open && (
        <div className="nav-menu">
          <div>
            <Link to="/" onClick={() => setOpen(false)}>
              Top Page
            </Link>
          </div>

          <hr />

          {TOOLS.map(tool => (
            <div key={tool.id}>
              <Link
                to={`/${tool.id}`}
                onClick={() => setOpen(false)}
              >
                {tool.name}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  )
}