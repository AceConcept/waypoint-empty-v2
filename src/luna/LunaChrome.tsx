import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { LunaCanvasScaleContext } from 'waypoint-sidebar/src/luna-sidebar/index.js'
import {
  getCanvasContainScale,
  getViewportSize,
  SIDEBAR_COLLAPSED_REM,
  SIDEBAR_EXPANDED_REM,
} from 'waypoint-sidebar/src/luna-sidebar/canvasScale.js'
import { applyLunaDocumentScale, resetLunaDocumentScale } from './applyLunaDocumentScale'
import { WaypointNavbar } from './WaypointNavbar'
import './lunaChrome.css'

export type LunaChromeSidebarControls = {
  expanded: boolean
  onExpandedChange: (next: boolean) => void
}

type LunaChromeProps = {
  children?: ReactNode
  footerBackgroundUrl?: string
  sidebar: (controls: LunaChromeSidebarControls) => ReactNode
}

export function LunaChrome({
  children,
  footerBackgroundUrl,
  sidebar,
}: LunaChromeProps) {
  const layoutRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [expanded, setExpanded] = useState(false)

  useLayoutEffect(() => {
    const el = layoutRef.current
    if (!el) return
    const update = () => {
      const size = getViewportSize()
      if (size.width <= 0 || size.height <= 0) {
        setScale(1)
        setViewport(size)
        return
      }
      setViewport(size)
      setScale(getCanvasContainScale(size.width, size.height))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    const vv = window.visualViewport
    if (vv) vv.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      if (vv) vv.removeEventListener('resize', update)
    }
  }, [])

  useLayoutEffect(() => {
    if (viewport.width <= 0 || viewport.height <= 0) return
    applyLunaDocumentScale(scale, viewport)
  }, [scale, viewport])

  useLayoutEffect(() => {
    return () => resetLunaDocumentScale()
  }, [])

  useLayoutEffect(() => {
    const layout = layoutRef.current
    if (!layout) return
    const shellRem = expanded ? SIDEBAR_EXPANDED_REM : SIDEBAR_COLLAPSED_REM
    layout.style.setProperty('--luna-shell-design-w', `${shellRem}rem`)
  }, [expanded])

  const footerSlotStyle =
    footerBackgroundUrl != null && footerBackgroundUrl !== ''
      ? { backgroundImage: `url(${footerBackgroundUrl})` }
      : undefined

  return (
    <div ref={layoutRef} className="luna-root">
      {expanded ? (
        <button
          type="button"
          className="luna-canvas-row-scrim"
          aria-label="Close panel"
          onClick={() => setExpanded(false)}
        />
      ) : null}
      <div
        className={`luna-canvas-row${expanded ? ' luna-canvas-row--drawer-open' : ''}`}
      >
        <WaypointNavbar />
        <div className="waypoint-horizontal">
          <div className="luna-space-left" aria-hidden="true" />
          <div className="luna-center-column">
            <div
              className={`luna-design-surface${expanded ? ' luna-design-surface--drawer-open' : ''}`}
            >
              {children}
            </div>
          </div>
          <div className="luna-space-right" aria-hidden="true" />
        </div>
        <LunaCanvasScaleContext.Provider value={scale}>
          {sidebar({ expanded, onExpandedChange: setExpanded })}
        </LunaCanvasScaleContext.Provider>
      </div>
      <div className="luna-footer-slot" style={footerSlotStyle}>
        <div className="luna-footer-artboard" aria-hidden="true" />
      </div>
    </div>
  )
}
