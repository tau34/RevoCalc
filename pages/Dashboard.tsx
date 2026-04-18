import { TOOLS } from "../types/ToolRegistry";
import { Link } from "react-router-dom"

export function Dashboard() {
  return (
    <div>
      <h1>Top Page</h1>
      <h2>Tools</h2>
      {TOOLS.map(tool => (
        <div style={{ border: "1px solid #ccc", margin: 10 }}>
          <Link key={tool.id} to={`/${tool.id}`}>
            <h3>{tool.name}</h3>
          </Link>
          <p>{tool.description}</p>
        </div>
      ))}
    </div>
  )
}