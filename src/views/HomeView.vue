<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/SearchBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import CheatSheetCard from '@/components/CheatSheetCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import CategoryHint from '@/components/CategoryHint.vue'
import CheatSheetModal from '@/components/CheatSheetModal.vue'
import CheatSheetViewModal from '@/components/CheatSheetViewModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import CategoryDialog from '@/components/CategoryDialog.vue'
import { useCheatSheetsStore } from '@/stores/cheatSheets'
import type { CheatSheet } from '@/types'

const toast = useToast()

const store = useCheatSheetsStore()
const {
  filteredCheatSheets,
  searchQuery,
  categories,
  activeCategory,
  cheatSheets,
  categoryCounts,
  isLoading,
} = storeToRefs(store)

// Initialize data on mount
onMounted(async () => {
  try {
    await Promise.all([
      store.fetchCheatSheets(),
      store.fetchCategories(),
    ])
  } catch (error) {
    toast.error('Failed to load data')
    console.error('Failed to initialize data:', error)
  }
})

const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isCategoryDialogOpen = ref(false)
const editingCheatSheet = ref<CheatSheet | null>(null)
const viewingCheatSheet = ref<CheatSheet | null>(null)
const isDeleteDialogOpen = ref(false)
const deletingId = ref<string | null>(null)
const isDeleteCategoryDialogOpen = ref(false)
const deletingCategory = ref<string | null>(null)
const isForceDeleteDialogOpen = ref(false)
const forceDeletingCategory = ref<string | null>(null)
const initialCategory = ref<string>('')

const hasNoCheatSheets = computed(
  () =>
    filteredCheatSheets.value.length === 0 && !searchQuery.value.trim() && !activeCategory.value,
)

const hasNoCategories = computed(() => categories.value.length === 0)

const handleSearch = (query: string): void => {
  store.setSearchQuery(query)
}

const handleCategoryChange = (category: string | null): void => {
  store.setActiveCategory(category)
}

const handleCreate = (): void => {
  editingCheatSheet.value = null
  initialCategory.value = ''
  isModalOpen.value = true
}

const handleCreateInCategory = (category: string): void => {
  editingCheatSheet.value = null
  initialCategory.value = category
  isModalOpen.value = true
}

const handleCreateCategory = (): void => {
  isCategoryDialogOpen.value = true
}

const handleCategorySave = async (category: string): Promise<void> => {
  try {
    await store.addCategory(category)
    isCategoryDialogOpen.value = false
    toast.success(`Category "${category}" created`)
  } catch (error) {
    toast.error('Failed to create category')
  }
}

const handleCloseCategoryDialog = (): void => {
  isCategoryDialogOpen.value = false
}

const handleDeleteCategoryRequest = (category: string): void => {
  // Check if category has cheat sheets
  const hasCheatSheets: boolean = cheatSheets.value.some(
    (sheet) => sheet.category === category,
  )

  if (hasCheatSheets) {
    forceDeletingCategory.value = category
    isForceDeleteDialogOpen.value = true
  } else {
    deletingCategory.value = category
    isDeleteCategoryDialogOpen.value = true
  }
}

const handleDeleteCategoryConfirm = async (): Promise<void> => {
  if (deletingCategory.value) {
    const success: boolean = await store.deleteCategory(deletingCategory.value)

    if (success) {
      // If we were viewing this category, switch to "All"
      if (activeCategory.value === deletingCategory.value) {
        store.setActiveCategory(null)
      }
      toast.success(`Category "${deletingCategory.value}" deleted`)
    } else {
      toast.error(`Cannot delete category "${deletingCategory.value}" - it contains cheat sheets`)
    }
    deletingCategory.value = null
  }
  isDeleteCategoryDialogOpen.value = false
}

const handleDeleteCategoryCancel = (): void => {
  deletingCategory.value = null
  isDeleteCategoryDialogOpen.value = false
}

const handleForceDeleteCategoryConfirm = async (): Promise<void> => {
  if (forceDeletingCategory.value) {
    const success: boolean = await store.forceDeleteCategory(forceDeletingCategory.value)

    if (success) {
      // If we were viewing this category, switch to "All"
      if (activeCategory.value === forceDeletingCategory.value) {
        store.setActiveCategory(null)
      }
      toast.success(`Category "${forceDeletingCategory.value}" and all its cheat sheets deleted`)
    } else {
      toast.error(`Failed to delete category "${forceDeletingCategory.value}"`)
    }
    forceDeletingCategory.value = null
  }
  isForceDeleteDialogOpen.value = false
}

const handleForceDeleteCategoryCancel = (): void => {
  forceDeletingCategory.value = null
  isForceDeleteDialogOpen.value = false
}

const handleView = (id: string): void => {
  const cheatSheet: CheatSheet | undefined = store.getById(id)
  if (cheatSheet) {
    viewingCheatSheet.value = cheatSheet
    isViewModalOpen.value = true
  }
}

const handleCloseViewModal = (): void => {
  isViewModalOpen.value = false
  viewingCheatSheet.value = null
}

const handleDeleteRequest = (id: string): void => {
  deletingId.value = id
  isDeleteDialogOpen.value = true
}

const handleDeleteConfirm = async (): Promise<void> => {
  if (deletingId.value) {
    try {
      await store.deleteCheatSheet(deletingId.value)
      toast.success('Cheat sheet deleted')
    } catch (error) {
      toast.error('Failed to delete cheat sheet')
    }
    deletingId.value = null
  }
  isDeleteDialogOpen.value = false
}

const handleDeleteCancel = (): void => {
  deletingId.value = null
  isDeleteDialogOpen.value = false
}

const handleSave = async (data: {
  title: string
  description: string
  category: string
  content: string
}): Promise<void> => {
  try {
    if (editingCheatSheet.value) {
      await store.updateCheatSheet(editingCheatSheet.value.id, {
        title: data.title,
        description: data.description,
        category: data.category,
        content: data.content,
      })
      toast.success('Cheat sheet updated!')
    } else {
      await store.addCheatSheet({
        title: data.title,
        description: data.description,
        category: data.category,
        content: data.content,
      })
      toast.success('Cheat sheet created!')
    }
    isModalOpen.value = false
    editingCheatSheet.value = null
  } catch (error) {
    toast.error('Failed to save cheat sheet')
  }
}

const handleCloseModal = (): void => {
  isModalOpen.value = false
  editingCheatSheet.value = null
  initialCategory.value = ''
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-8">
    <SearchBar :model-value="searchQuery" @update:model-value="handleSearch" />

    <CategoryTabs
      :categories="categories"
      :active-category="activeCategory"
      :total-count="cheatSheets.length"
      :category-counts="categoryCounts"
      @update:active-category="handleCategoryChange"
      @create-in-category="handleCreateInCategory"
      @create-category="handleCreateCategory"
      @delete-category="handleDeleteCategoryRequest"
    />

    <div class="grid grid-cols-12 gap-6" style="grid-auto-rows: min-content">
      <CheatSheetCard
        v-for="cheatSheet in filteredCheatSheets"
        :key="cheatSheet.id"
        :cheat-sheet="cheatSheet"
        :total-count="filteredCheatSheets.length"
        @view="handleView"
        @delete="handleDeleteRequest"
      />

      <div v-if="hasNoCategories" class="col-span-full">
        <CategoryHint @create-category="handleCreateCategory" />
      </div>

      <div v-else-if="hasNoCheatSheets" class="col-span-full">
        <EmptyState @create="handleCreate" />
      </div>
    </div>

    <div
      v-if="filteredCheatSheets.length === 0 && (searchQuery.trim() || activeCategory)"
      class="text-center py-12"
    >
      <div class="text-[var(--color-text-secondary)]">
        <font-awesome-icon
          icon="file-alt"
          class="w-16 h-16 mx-auto mb-4 opacity-50"
        />
        <p class="text-lg">
          {{
            searchQuery.trim()
              ? 'No cheat sheets found for your search'
              : `No cheat sheets in "${activeCategory}" category`
          }}
        </p>
        <p class="text-sm mt-2 opacity-70">Try adjusting your filters</p>
      </div>
    </div>
  </main>

  <!-- Modals -->
  <CheatSheetModal
    :is-open="isModalOpen"
    :cheat-sheet="editingCheatSheet"
    :initial-category="initialCategory"
    @close="handleCloseModal"
    @save="handleSave"
  />

  <CheatSheetViewModal
    :is-open="isViewModalOpen"
    :cheat-sheet="viewingCheatSheet"
    @close="handleCloseViewModal"
  />

  <ConfirmDialog
    :is-open="isDeleteDialogOpen"
    title="Delete Cheat Sheet"
    message="Are you sure you want to delete this cheat sheet? This action cannot be undone."
    confirm-text="Delete"
    cancel-text="Cancel"
    :is-danger="true"
    @confirm="handleDeleteConfirm"
    @cancel="handleDeleteCancel"
  />

  <CategoryDialog
    :is-open="isCategoryDialogOpen"
    :existing-categories="categories"
    @close="handleCloseCategoryDialog"
    @save="handleCategorySave"
  />

  <ConfirmDialog
    :is-open="isDeleteCategoryDialogOpen"
    title="Delete Category"
    :message="`Are you sure you want to delete the category '${deletingCategory}'?`"
    confirm-text="Delete"
    cancel-text="Cancel"
    :is-danger="true"
    @confirm="handleDeleteCategoryConfirm"
    @cancel="handleDeleteCategoryCancel"
  />

  <ConfirmDialog
    :is-open="isForceDeleteDialogOpen"
    title="Delete Category with Cheat Sheets"
    :message="`The category '${forceDeletingCategory}' contains cheat sheets. Deleting it will also delete all cheat sheets in this category. This action cannot be undone. Are you sure?`"
    confirm-text="Delete All"
    cancel-text="Cancel"
    :is-danger="true"
    @confirm="handleForceDeleteCategoryConfirm"
    @cancel="handleForceDeleteCategoryCancel"
  />
</template>
