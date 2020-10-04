import React, { useEffect, useRef, useState } from 'react'
import { animated, useSprings } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { useChildHeightSpring } from './useChildHeightSpring'
import { useInternalGalleryContext } from './GalleryContext'
import { usePreventClick } from './usePreventClick'
import styles from './Gallery.module.css'

export const Gallery: React.FC = ({ children }) => {
  const { length } = React.Children.toArray(children)

  const {
    contextIndex,
    setContextIndex,
    setContextLength
  } = useInternalGalleryContext()

  useEffect(() => {
    setContextLength(length)
  }, [length])

  const [index, setIndex] = useState(contextIndex)
  const [listRef, listSpring] = useChildHeightSpring<HTMLUListElement>(index)
  const lengthRef = useRef(length)
  lengthRef.current = length
  const [setPrevent, preventClick] = usePreventClick<HTMLUListElement>()

  const [itemSprings, setItemSprings] = useSprings(length, (i) => ({
    x: i - contextIndex
  }))

  const adjust = (index: number) => {
    setItemSprings((i) => ({ x: i - index, immediate: false }))
    return index
  }

  useEffect(() => {
    adjust(index)
    setContextIndex(index)
  }, [index])

  useEffect(() => {
    setIndex(contextIndex)
  }, [contextIndex])

  const bind = useDrag(
    ({ down, movement: [mx], vxvy: [vx], first, distance }) => {
      setIndex((index) => {
        if (!listRef.current) return index

        if (first) {
          setPrevent(false)
        } else if (distance > 5) {
          setPrevent(true)
        }

        const width = listRef.current.offsetWidth

        if (down) {
          const mul =
            (index === 0 && mx > 0) ||
            (index === lengthRef.current - 1 && mx < 0)
              ? 0.5
              : 1
          setItemSprings((i) => ({
            x: i - index + (mx / width) * mul,
            immediate: true
          }))
          return index
        } else if (vx < -0.5) {
          return adjust(Math.min(index + 1, lengthRef.current - 1))
        } else if (vx > 0.5) {
          return adjust(Math.max(index - 1, 0))
        } else if (mx < width * -0.5) {
          return adjust(Math.min(index + 1, lengthRef.current - 1))
        } else if (mx > width * 0.5) {
          return adjust(Math.max(index - 1, 0))
        } else {
          return adjust(index)
        }
      })
    }
  )

  return (
    <div className={styles.Gallery}>
      <animated.ul
        {...bind()}
        ref={listRef}
        style={listSpring}
        onClickCapture={preventClick}
      >
        {itemSprings.map(({ x }, i) => (
          <animated.li
            key={i.toString()}
            style={{ transform: x.to((v) => `translate3d(${v * 100}%, 0, 0)`) }}
          >
            {React.Children.toArray(children)[i]}
          </animated.li>
        ))}
      </animated.ul>
    </div>
  )
}
