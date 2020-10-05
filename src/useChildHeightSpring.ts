import { RefObject, useEffect } from 'react'
import { SpringValue, useSpring } from 'react-spring'
import { useChildSizes } from 'use-child-sizes'

export function useChildHeightSpring<T extends HTMLElement>(
  index: number,
  adaptation: 'active' | 'min' | 'max'
): [RefObject<T>, { height: SpringValue<number> }] {
  const [ref, sizes] = useChildSizes<T>()
  const [spring, setSpring] = useSpring(() => ({ height: 0 }))

  useEffect(() => {
    const heights = sizes.map(({ height }) => height)

    if (heights.every((height) => !height)) {
      setSpring(() => ({ height: 0 }))
      return
    }

    if (heights.every((height) => height === heights[0])) {
      setSpring(() => ({ height: heights[0], immediate: true }))
      return
    }

    if (
      adaptation === 'active' &&
      heights[index] !== undefined &&
      heights[index] !== 0
    ) {
      setSpring(() => ({ height: heights[index] }))
    } else if (adaptation === 'active' || adaptation === 'min') {
      setSpring(() => ({
        height: heights
          .filter((height) => height)
          .reduce(
            (min, height) => (height < min ? height : min),
            Number.MAX_VALUE
          )
      }))
    } else {
      setSpring(() => ({
        height: heights.reduce(
          (max, height) => (height > max ? height : max),
          Number.MIN_VALUE
        )
      }))
    }
  }, [index, adaptation, sizes])

  return [ref, spring]
}
