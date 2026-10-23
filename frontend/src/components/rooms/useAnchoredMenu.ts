import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'

interface MenuPosition {
  top: number
  left: number
  width: number
  maxHeight: number
}

export function useAnchoredMenu(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  estimatedHeight = 280,
  menuWidth?: number,
  alignEnd = false,
) {
  const [position, setPosition] = useState<MenuPosition | null>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return

      const bounds = trigger.getBoundingClientRect()
      const width = menuWidth ?? bounds.width
      const gap = 4
      const viewportPadding = 8
      const below = Math.max(0, window.innerHeight - bounds.bottom - viewportPadding - gap)
      const above = Math.max(0, bounds.top - viewportPadding - gap)
      const openAbove = below < Math.min(estimatedHeight, 180) && above > below
      const maxHeight = Math.max(64, Math.min(estimatedHeight, openAbove ? above : below))
      const desiredTop = openAbove ? bounds.top - gap - maxHeight : bounds.bottom + gap
      const top = Math.max(viewportPadding, Math.min(desiredTop, window.innerHeight - maxHeight - viewportPadding))

      setPosition({
        top,
        left: Math.max(viewportPadding, Math.min(alignEnd ? bounds.right - width : bounds.left, window.innerWidth - width - viewportPadding)),
        width,
        maxHeight,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [alignEnd, estimatedHeight, menuWidth, open, triggerRef])

  const menuStyle: CSSProperties | undefined = position
    ? { position: 'fixed', top: position.top, left: position.left, width: position.width, maxHeight: position.maxHeight, zIndex: 70 }
    : undefined

  return menuStyle
}
