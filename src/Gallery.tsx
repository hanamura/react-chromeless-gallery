import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring, useSprings } from 'react-spring'
import { useChildSizes } from 'use-child-sizes'
import { useDrag } from 'react-use-gesture'

import styles from './Gallery.module.css'

export const Gallery: React.FC = ({ children }) => {
  const { length } = React.Children.toArray(children)

  const [ulRef, liSizes] = useChildSizes<HTMLUListElement>()
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)
  const lengthRef = useRef(length)
  lengthRef.current = length

  const [itemSprings, setItemSprings] = useSprings(length, (i) => ({ x: i }))
  const [listSpring, setListSpring] = useSpring(() => ({ height: 0 }))

  useEffect(() => {
    const heights = liSizes.map(({ height }) => height)

    if (heights.every((height) => height === heights[0])) {
      setListSpring(() => ({ height: heights[0], immediate: true }))
    } else if (heights[index] !== undefined && heights[index] !== 0) {
      setListSpring(() => ({ height: heights[index] }))
    } else if (heights.some((height) => height)) {
      setListSpring(() => ({
        height: heights
          .filter((height) => height)
          .reduce(
            (min, height) => (height < min ? height : min),
            Number.MAX_VALUE
          )
      }))
    } else {
      setListSpring(() => ({ height: 0 }))
    }
  }, [index, liSizes])

  const adjust = () => {
    setItemSprings((i) => ({ x: i - indexRef.current, immediate: false }))
    setIndex(indexRef.current)
  }

  const next = () => {
    indexRef.current = Math.min(indexRef.current + 1, lengthRef.current - 1)
    adjust()
  }

  const prev = () => {
    indexRef.current = Math.max(indexRef.current - 1, 0)
    adjust()
  }

  const preventClickRef = useRef(false)

  const bind = useDrag(
    ({ down, movement: [mx], vxvy: [vx], first, distance }) => {
      if (!ulRef.current) return

      const width = ulRef.current.offsetWidth

      if (down) {
        const mul =
          (indexRef.current === 0 && mx > 0) ||
          (indexRef.current === lengthRef.current - 1 && mx < 0)
            ? 0.5
            : 1
        setItemSprings((i) => ({
          x: i - indexRef.current + (mx / width) * mul,
          immediate: true
        }))
      } else if (vx < -0.5) {
        next()
      } else if (vx > 0.5) {
        prev()
      } else if (mx < width * -0.5) {
        next()
      } else if (mx > width * 0.5) {
        prev()
      } else {
        adjust()
      }

      if (first) {
        preventClickRef.current = false
      } else if (distance > 5) {
        preventClickRef.current = true
      }
    }
  )

  const preventClick = (e: React.MouseEvent<HTMLUListElement>) => {
    if (preventClickRef.current) e.preventDefault()
  }

  return (
    <div className={styles.Gallery}>
      <animated.ul
        {...bind()}
        ref={ulRef}
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
