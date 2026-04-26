import { TOOLS } from "../types/ToolRegistry";
import { Link } from "react-router-dom"
import { localize, useLocale } from "../i18n";

export function Dashboard() {
  const locale = useLocale();

  return (
    <div>
      <h1>{locale === "ja" ? "トップページ" : "Top Page"}</h1>
      <h2>{locale === "ja" ? "ツール" : "Tools"}</h2>
      {TOOLS.map(tool => (
        <div key={tool.id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <Link key={tool.id} to={`/${tool.id}`}>
            <h3>{localize(tool.name, locale)}</h3>
          </Link>
          <p>{localize(tool.description, locale)}</p>
        </div>
      ))}
    </div>
  )
}