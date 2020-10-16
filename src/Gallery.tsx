import React, { useEffect, useRef, useState } from 'react'
import { animated, useSprings } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { useChildHeightSpring } from './useChildHeightSpring'
import { useInternalGalleryContext } from './GalleryContext'
import { usePreventClick } from './usePreventClick'
import styles from './Gallery.module.css'

interface GalleryProps {
  containerHeight?: 'active' | 'min' | 'max'
  showOverflow?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Gallery: React.FC<GalleryProps> = ({
  containerHeight = 'active',
  showOverflow = false,
  className,
  style,
  children
}) => {
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
  const [listRef, listSpring] = useChildHeightSpring<HTMLUListElement>(
    index,
    containerHeight
  )
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
    },
    {
      axis: 'x'
    }
  )

  return (
    <div
      className={`${styles.Gallery} ${
        showOverflow ? styles.isShowOverflow : ''
      } ${className || ''}`}
      style={style}
    >
      <animated.ul
        {...bind()}
        ref={listRef}
        style={listSpring}
        onClickCapture={preventClick}
      >
        {itemSprings.map(({ x }, i) => (
          <animated.li
            key={i.toString()}
            style={
              showOverflow
                ? {
                    transform: x.to((v) => `translate3d(${v * 100}%, 0, 0)`)
                  }
                : {
                    transform: x.to((v) =>
                      v <= -1
                        ? 'translate3d(-100%, 0, 0)'
                        : 1 <= v
                        ? 'translate3d(100%, 0, 0)'
                        : `translate3d(${v * 100}%, 0, 0)`
                    )
                  }
            }
          >
            {React.Children.toArray(children)[i]}
          </animated.li>
        ))}
      </animated.ul>
    </div>
  )
}
