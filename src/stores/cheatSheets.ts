import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CheatSheet, CheatSheetInput, CheatSheetUpdate } from '@/types'
import { api } from '@/services/api'

export const useCheatSheetsStore = defineStore('cheatSheets', () => {
  const cheatSheets = ref<CheatSheet[]>([])
  const customCategories = ref<string[]>([])
  const searchQuery = ref<string>('')
  const activeCategory = ref<string | null>(null)
  const isLoading = ref<boolean>(false)

  // Getters
  const filteredCheatSheets = computed<CheatSheet[]>(() => {
    let filtered: CheatSheet[] = cheatSheets.value

    // Filter by category
    if (activeCategory.value) {
      filtered = filtered.filter((sheet) => sheet.category === activeCategory.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query: string = searchQuery.value.toLowerCase()
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

  const categories = computed<string[]>(() => {
    // Combine custom categories and categories from cheat sheets
    const fromSheets: string[] = cheatSheets.value
      .map((sheet) => sheet.category)
      .filter((category) => category.trim())
    const allCategories: Set<string> = new Set([...customCategories.value, ...fromSheets])
    return Array.from(allCategories).sort()
  })

  const categoryCounts = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    cheatSheets.value.forEach((sheet) => {
      if (sheet.category) {
        counts[sheet.category] = (counts[sheet.category] || 0) + 1
      }
    })
    return counts
  })

  const getById = (id: string): CheatSheet | undefined => {
    return cheatSheets.value.find((sheet) => sheet.id === id)
  }

  // Actions
  const fetchCheatSheets = async (): Promise<void> => {
    isLoading.value = true
    try {
      const sheets: CheatSheet[] = await api.getCheatSheets()
      cheatSheets.value = sheets
    } catch (error) {
      console.error('Failed to fetch cheat sheets:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async (): Promise<void> => {
    try {
      const cats: string[] = await api.getCategories()
      customCategories.value = cats
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  }

  const addCategory = async (category: string): Promise<void> => {
    const trimmed: string = category.trim()
    if (!trimmed) return
    if (customCategories.value.includes(trimmed)) return

    try {
      await api.createCategory(trimmed)
      await fetchCategories()
    } catch (error) {
      console.error('Failed to add category:', error)
      throw error
    }
  }

  const deleteCategory = async (category: string): Promise<boolean> => {
    // Check if there are any cheat sheets using this category
    const hasCheatSheets: boolean = cheatSheets.value.some((sheet) => sheet.category === category)
    if (hasCheatSheets) {
      return false // Cannot delete category with cheat sheets
    }

    try {
      await api.deleteCategory(category, false)
      await fetchCategories()
      return true
    } catch (error) {
      console.error('Failed to delete category:', error)
      return false
    }
  }

  const forceDeleteCategory = async (category: string): Promise<boolean> => {
    try {
      await api.deleteCategory(category, true)
      await fetchCategories()
      await fetchCheatSheets()
      return true
    } catch (error) {
      console.error('Failed to force delete category:', error)
      return false
    }
  }

  const addCheatSheet = async (input: CheatSheetInput): Promise<CheatSheet> => {
    try {
      const newSheet: CheatSheet = await api.createCheatSheet(input)
      cheatSheets.value.unshift(newSheet)
      return newSheet
    } catch (error) {
      console.error('Failed to add cheat sheet:', error)
      throw error
    }
  }

  const updateCheatSheet = async (id: string, updates: CheatSheetUpdate): Promise<void> => {
    try {
      const updatedSheet: CheatSheet = await api.updateCheatSheet(id, updates)
      const index: number = cheatSheets.value.findIndex((sheet) => sheet.id === id)
      if (index !== -1) {
        cheatSheets.value[index] = updatedSheet
      }
    } catch (error) {
      console.error('Failed to update cheat sheet:', error)
      throw error
    }
  }

  const deleteCheatSheet = async (id: string): Promise<void> => {
    try {
      await api.deleteCheatSheet(id)
      const index: number = cheatSheets.value.findIndex((sheet) => sheet.id === id)
      if (index !== -1) {
        cheatSheets.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to delete cheat sheet:', error)
      throw error
    }
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
    isLoading: computed(() => isLoading.value),

    // Getters
    filteredCheatSheets,
    categories,
    categoryCounts,
    getById,

    // Actions
    fetchCheatSheets,
    fetchCategories,
    addCheatSheet,
    updateCheatSheet,
    deleteCheatSheet,
    setSearchQuery,
    clearSearch,
    setActiveCategory,
    addCategory,
    deleteCategory,
    forceDeleteCategory,
  }
})
