export function useLocalStorage<T>(key: string, initialValue: T) {
  const getItem = (): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const setItem = (value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
    }
  }

  const removeItem = (): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error)
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
  }
}
