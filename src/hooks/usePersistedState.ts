import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * localStorageに値を保持するuseState。
 * ページ遷移してもフォーム入力値が消えない。
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const storageKey = `kuriage-sim:${key}`

  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // localStorage unavailable or parse error
    }
    return defaultValue
  })

  // stateが変わるたびにlocalStorageへ書き込み
  const isFirstRender = useRef(true)
  useEffect(() => {
    // 初回レンダリング時はスキップ（読み出した値をそのまま書き戻すのを防ぐ）
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // quota exceeded or unavailable
    }
  }, [state, storageKey])

  const setPersistedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value)
    },
    [],
  )

  return [state, setPersistedState]
}
