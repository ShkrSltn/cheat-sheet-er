import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CheatSheet, CheatSheetInput, CheatSheetUpdate } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'

const STORAGE_KEY = 'cheat-sheets'
const CATEGORIES_KEY = 'categories'

export const useCheatSheetsStore = defineStore('cheatSheets', () => {
  const storage = useLocalStorage<CheatSheet[]>(STORAGE_KEY, [])
  const categoriesStorage = useLocalStorage<string[]>(CATEGORIES_KEY, [])

  const cheatSheets = ref<CheatSheet[]>(storage.getItem())
  const customCategories = ref<string[]>(categoriesStorage.getItem())
  const searchQuery = ref('')
  const activeCategory = ref<string | null>(null)

  // Getters
  const filteredCheatSheets = computed(() => {
    let filtered = cheatSheets.value

    // Filter by category
    if (activeCategory.value) {
      filtered = filtered.filter((sheet) => sheet.category === activeCategory.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (sheet) =>
          sheet.title.toLowerCase().includes(query) ||
          sheet.description.toLowerCase().includes(query) ||
          sheet.category.toLowerCase().includes(query) ||
          sheet.content.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  const categories = computed(() => {
    // Combine custom categories and categories from cheat sheets
    const fromSheets = cheatSheets.value
      .map((sheet) => sheet.category)
      .filter((category) => category.trim())
    const allCategories = new Set([...customCategories.value, ...fromSheets])
    return Array.from(allCategories).sort()
  })

  const categoryCounts = computed(() => {
    const counts: Record<string, number> = {}
    cheatSheets.value.forEach((sheet) => {
      if (sheet.category) {
        counts[sheet.category] = (counts[sheet.category] || 0) + 1
      }
    })
    return counts
  })

  const getById = (id: string) => {
    return cheatSheets.value.find((sheet) => sheet.id === id)
  }

  // Actions
  const generateId = (): string => {
    return crypto.randomUUID()
  }

  const getCurrentTimestamp = (): string => {
    return new Date().toISOString()
  }

  const saveToStorage = () => {
    storage.setItem(cheatSheets.value)
  }

  const saveCategoriesToStorage = () => {
    categoriesStorage.setItem(customCategories.value)
  }

  const addCategory = (category: string): void => {
    const trimmed = category.trim()
    if (!trimmed) return
    if (customCategories.value.includes(trimmed)) return

    customCategories.value.push(trimmed)
    customCategories.value.sort()
    saveCategoriesToStorage()
  }

  const deleteCategory = (category: string): void => {
    const index = customCategories.value.indexOf(category)
    if (index === -1) return

    customCategories.value.splice(index, 1)
    saveCategoriesToStorage()
  }

  const addCheatSheet = (input: CheatSheetInput): CheatSheet => {
    const timestamp = getCurrentTimestamp()
    const newSheet: CheatSheet = {
      id: generateId(),
      ...input,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    cheatSheets.value.unshift(newSheet)
    saveToStorage()
    return newSheet
  }

  const updateCheatSheet = (id: string, updates: CheatSheetUpdate): void => {
    const index = cheatSheets.value.findIndex((sheet) => sheet.id === id)

    if (index === -1) {
      console.error(`CheatSheet with id "${id}" not found`)
      return
    }

    const currentSheet = cheatSheets.value[index]!
    cheatSheets.value[index] = {
      id: currentSheet.id,
      createdAt: currentSheet.createdAt,
      title: updates.title ?? currentSheet.title,
      description: updates.description ?? currentSheet.description,
      category: updates.category ?? currentSheet.category,
      content: updates.content ?? currentSheet.content,
      updatedAt: getCurrentTimestamp(),
    }

    saveToStorage()
  }

  const deleteCheatSheet = (id: string): void => {
    const index = cheatSheets.value.findIndex((sheet) => sheet.id === id)

    if (index === -1) {
      console.error(`CheatSheet with id "${id}" not found`)
      return
    }

    cheatSheets.value.splice(index, 1)
    saveToStorage()
  }

  const setSearchQuery = (query: string): void => {
    searchQuery.value = query
  }

  const clearSearch = (): void => {
    searchQuery.value = ''
  }

  const setActiveCategory = (category: string | null): void => {
    activeCategory.value = category
  }

  return {
    // State
    cheatSheets: computed(() => cheatSheets.value),
    searchQuery: computed(() => searchQuery.value),
    activeCategory: computed(() => activeCategory.value),

    // Getters
    filteredCheatSheets,
    categories,
    categoryCounts,
    getById,

    // Actions
    addCheatSheet,
    updateCheatSheet,
    deleteCheatSheet,
    setSearchQuery,
    clearSearch,
    setActiveCategory,
    addCategory,
    deleteCategory,
  }
})
