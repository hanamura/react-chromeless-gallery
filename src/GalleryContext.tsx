import React, { createContext, useContext, useReducer } from 'react'

interface State {
  index: number
  length: number
}
type Action = { type: 'index' | 'length'; value: number }

const initialState: State = { index: 0, length: 0 }

export const GalleryContext = createContext<{
  state: State
  dispatch: (action: Action) => void
}>({ state: { ...initialState }, dispatch: () => {} })

// provider

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'length':
      return { ...state, length: action.value }
    case 'index':
      return { ...state, index: action.value }
  }
}

export const GalleryProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <GalleryContext.Provider value={{ state, dispatch }}>
      {children}
    </GalleryContext.Provider>
  )
}

// consumer

interface GalleryConsumerProps {
  children: (args: {
    index: number
    length: number
    to: (index: number) => void
    prev: () => void
    next: () => void
    hasNext: boolean
    hasPrev: boolean
  }) => React.ReactNode
}

export const GalleryConsumer: React.FC<GalleryConsumerProps> = ({
  children
}) => (
  <GalleryContext.Consumer>
    {({ state: { index, length }, dispatch }) => {
      const to = (index: number) => {
        if (!dispatch) return
        if (index < 0) return
        if (index >= length) return
        dispatch({ type: 'index', value: index })
      }
      const prev = () => to(index - 1)
      const next = () => to(index + 1)
      const hasPrev = index > 0
      const hasNext = index < length - 1

      return children({ index, length, to, prev, next, hasPrev, hasNext })
    }}
  </GalleryContext.Consumer>
)

// hook

export const useInternalGalleryContext = () => {
  const { state, dispatch } = useContext(GalleryContext)
  return {
    contextIndex: state.index,
    setContextIndex: (index: number) =>
      dispatch({ type: 'index', value: index }),
    setContextLength: (length: number) =>
      dispatch({ type: 'length', value: length })
  }
}
