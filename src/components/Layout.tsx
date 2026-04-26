import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { TOOLS } from "../types/ToolRegistry"
import { localize, useLocale, useSetLocale } from "../i18n"

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false)
  const locale = useLocale()
  const setLocale = useSetLocale()
  const localeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!localeMenuRef.current?.contains(event.target as Node)) {
        setLocaleMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  return (
    <div>
      <div className="header">
        <div className={`hamburger-menu ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <h3 className={`title ${open ? 'active' : ''}`}>
          {locale === "ja" ? "Revolution Idle 計算ツール" : "Revolution Idle Calculators"}
        </h3>
        <div className="locale-menu" ref={localeMenuRef}>
          <button
            type="button"
            className="locale-trigger"
            aria-label={locale === "ja" ? "言語を選択" : "Select language"}
            onClick={() => setLocaleMenuOpen(!localeMenuOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <ellipse cx="12" cy="12" rx="4.2" ry="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 12h18M5 7.5h14M5 16.5h14" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>

          {localeMenuOpen && (
            <div className="locale-options">
              <button
                type="button"
                className={locale === "ja" ? "active" : ""}
                onClick={() => {
                  setLocale("ja")
                  setLocaleMenuOpen(false)
                }}
              >
                日本語
              </button>
              <button
                type="button"
                className={locale === "en" ? "active" : ""}
                onClick={() => {
                  setLocale("en")
                  setLocaleMenuOpen(false)
                }}
              >
                English
              </button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="nav-menu">
          <div>
            <Link to="/" onClick={() => setOpen(false)}>
              {locale === "ja" ? "トップページ" : "Top Page"}
            </Link>
          </div>

          <hr />

          {TOOLS.map(tool => (
            <div key={tool.id}>
              <Link
                to={`/${tool.id}`}
                onClick={() => setOpen(false)}
              >
                {localize(tool.name, locale)}
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