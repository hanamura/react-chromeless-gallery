import React, { RefObject, useEffect, useRef, useState } from 'react'
import { animated, SpringValue, useSpring, useSprings } from 'react-spring'
import { useChildSizes } from 'use-child-sizes'
import { useDrag } from 'react-use-gesture'

import styles from './Gallery.module.css'

function useChildHeightSpring<T extends HTMLElement>(
  index: number
): [RefObject<T>, { height: SpringValue<number> }] {
  const [ref, sizes] = useChildSizes<T>()
  const [spring, setSpring] = useSpring(() => ({ height: 0 }))

  useEffect(() => {
    const heights = sizes.map(({ height }) => height)

    if (heights.every((height) => height === heights[0])) {
      setSpring(() => ({ height: heights[0], immediate: true }))
    } else if (heights[index] !== undefined && heights[index] !== 0) {
      setSpring(() => ({ height: heights[index] }))
    } else if (heights.some((height) => height)) {
      setSpring(() => ({
        height: heights
          .filter((height) => height)
          .reduce(
            (min, height) => (height < min ? height : min),
            Number.MAX_VALUE
          )
      }))
    } else {
      setSpring(() => ({ height: 0 }))
    }
  }, [index, sizes])

  return [ref, spring]
}

function usePreventClick<T extends HTMLElement>(): [
  (prevent: boolean) => void,
  (e: React.MouseEvent<T>) => void
] {
  const [prevent, setPrevent] = useState(false)
  const preventClick = (e: React.MouseEvent<T>) => {
    if (prevent) e.preventDefault()
  }
  return [setPrevent, preventClick]
}

export const Gallery: React.FC = ({ children }) => {
  const { length } = React.Children.toArray(children)

  const [index, setIndex] = useState(0)
  const [listRef, listSpring] = useChildHeightSpring<HTMLUListElement>(index)
  const lengthRef = useRef(length)
  lengthRef.current = length
  const [setPrevent, preventClick] = usePreventClick<HTMLUListElement>()

  const [itemSprings, setItemSprings] = useSprings(length, (i) => ({ x: i }))

  const adjust = (index: number) => {
    setItemSprings((i) => ({ x: i - index, immediate: false }))
    return index
  }

  useEffect(() => {
    adjust(index)
  }, [index])

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
