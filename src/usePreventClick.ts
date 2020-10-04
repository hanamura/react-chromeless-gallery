import React, { useState } from 'react'

export function usePreventClick<T extends HTMLElement>(): [
  (prevent: boolean) => void,
  (e: React.MouseEvent<T>) => void
] {
  const [prevent, setPrevent] = useState(false)
  const preventClick = (e: React.MouseEvent<T>) => {
    if (prevent) e.preventDefault()
  }
  return [setPrevent, preventClick]
}
