import { useState, useCallback } from 'react'

/**
 * localStorageに値を保持するuseState。
 * ページ遷移してもフォーム入力値が消えない。
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const storageKey = `kuriage-sim:${key}`

  const [state, setStateRaw] = useState<T>(() => {
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

  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStateRaw((prev) => {
        const next = typeof value === 'function'
          ? (value as (prev: T) => T)(prev)
          : value
        try {
          localStorage.setItem(storageKey, JSON.stringify(next))
        } catch {
          // quota exceeded or unavailable
        }
        return next
      })
    },
    [storageKey],
  )

  return [state, setState]
}
