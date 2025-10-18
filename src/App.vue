<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'
import AppHeader from '@/components/AppHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryTabs from '@/components/CategoryTabs.vue'
import CheatSheetCard from '@/components/CheatSheetCard.vue'
import EmptyState from '@/components/EmptyState.vue'
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
} = storeToRefs(store)

const isModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isCategoryDialogOpen = ref(false)
const editingCheatSheet = ref<CheatSheet | null>(null)
const viewingCheatSheet = ref<CheatSheet | null>(null)
const isDeleteDialogOpen = ref(false)
const deletingId = ref<string | null>(null)
const isDeleteCategoryDialogOpen = ref(false)
const deletingCategory = ref<string | null>(null)
const initialCategory = ref<string>('')

const hasNoCheatSheets = computed(
  () =>
    filteredCheatSheets.value.length === 0 && !searchQuery.value.trim() && !activeCategory.value,
)

const handleSearch = (query: string) => {
  store.setSearchQuery(query)
}

const handleCategoryChange = (category: string | null) => {
  store.setActiveCategory(category)
}

const handleCreate = () => {
  editingCheatSheet.value = null
  initialCategory.value = ''
  isModalOpen.value = true
}

const handleCreateInCategory = (category: string) => {
  editingCheatSheet.value = null
  initialCategory.value = category
  isModalOpen.value = true
}

const handleCreateCategory = () => {
  isCategoryDialogOpen.value = true
}

const handleCategorySave = (category: string) => {
  store.addCategory(category)
  isCategoryDialogOpen.value = false
  toast.success(`Category "${category}" created`)
}

const handleCloseCategoryDialog = () => {
  isCategoryDialogOpen.value = false
}

const handleDeleteCategoryRequest = (category: string) => {
  deletingCategory.value = category
  isDeleteCategoryDialogOpen.value = true
}

const handleDeleteCategoryConfirm = () => {
  if (deletingCategory.value) {
    store.deleteCategory(deletingCategory.value)

    // If we were viewing this category, switch to "All"
    if (activeCategory.value === deletingCategory.value) {
      store.setActiveCategory(null)
    }

    toast.success(`Category "${deletingCategory.value}" deleted`)
    deletingCategory.value = null
  }
  isDeleteCategoryDialogOpen.value = false
}

const handleDeleteCategoryCancel = () => {
  deletingCategory.value = null
  isDeleteCategoryDialogOpen.value = false
}

const handleView = (id: string) => {
  const cheatSheet = store.getById(id)
  if (cheatSheet) {
    viewingCheatSheet.value = cheatSheet
    isViewModalOpen.value = true
  }
}

const handleCloseViewModal = () => {
  isViewModalOpen.value = false
  viewingCheatSheet.value = null
}

const handleDeleteRequest = (id: string) => {
  deletingId.value = id
  isDeleteDialogOpen.value = true
}

const handleDeleteConfirm = () => {
  if (deletingId.value) {
    store.deleteCheatSheet(deletingId.value)
    toast.success('Cheat sheet deleted')
    deletingId.value = null
  }
  isDeleteDialogOpen.value = false
}

const handleDeleteCancel = () => {
  deletingId.value = null
  isDeleteDialogOpen.value = false
}

const handleSave = (data: {
  title: string
  description: string
  category: string
  content: string
}) => {
  if (editingCheatSheet.value) {
    store.updateCheatSheet(editingCheatSheet.value.id, {
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
    })
    toast.success('Cheat sheet updated!')
  } else {
    store.addCheatSheet({
      title: data.title,
      description: data.description,
      category: data.category,
      content: data.content,
    })
    toast.success('Cheat sheet created!')
  }
  isModalOpen.value = false
  editingCheatSheet.value = null
}

const handleCloseModal = () => {
  isModalOpen.value = false
  editingCheatSheet.value = null
  initialCategory.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
    <AppHeader />

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

        <div v-if="hasNoCheatSheets" class="col-span-full">
          <EmptyState @create="handleCreate" />
        </div>
      </div>

      <div
        v-if="filteredCheatSheets.length === 0 && (searchQuery.trim() || activeCategory)"
        class="text-center py-12"
      >
        <div class="text-[var(--color-text-secondary)]">
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
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
      :message="`Are you sure you want to delete the category '${deletingCategory}'? Cheat sheets in this category will not be deleted.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :is-danger="true"
      @confirm="handleDeleteCategoryConfirm"
      @cancel="handleDeleteCategoryCancel"
    />
  </div>
</template>
