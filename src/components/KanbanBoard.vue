<template>
  <div class="board">
    <header class="board-header">
      <h1>Kanban Доска</h1>
    </header>

    <Statistics />

    <div class="board-columns">
      <Column
          v-for="column in columns"
          :key="column.id"
          :column="column"
          @create-card="openCreateModal"
          @edit-card="openEditModal"
          @delete-card="handleDeleteCard"
          @move-card="handleMoveCard"
          @return-to-work="handleReturnToWork"
      />
    </div>

    <CardModal
        v-if="showModal"
        :card="editingCard"
        @close="closeModal"
        @save="handleSaveCard"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useKanbanStore } from '@/stores/kanbanStore'
import Column from './Column.vue'
import CardModal from './CardModal.vue'
import Statistics from './Statistics.vue'

const store = useKanbanStore()
const { columns } = storeToRefs(store)

const showModal = ref(false)
const editingCard = ref(null)

const openCreateModal = () => {
  editingCard.value = null
  showModal.value = true
}

const openEditModal = (card) => {
  editingCard.value = card
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCard.value = null
}

const handleSaveCard = (cardData) => {
  if (editingCard.value) {
    // Редактирование
    store.updateCard(editingCard.value.id, cardData)
  } else {
    // Создание
    store.createCard(cardData)
  }
}

const handleDeleteCard = (cardId) => {
  store.deleteCard(cardId)
}

const handleMoveCard = ({ cardId, targetColumnId }) => {
  store.moveCard(cardId, targetColumnId)
}

const handleReturnToWork = ({ cardId, reason }) => {
  store.moveCard(cardId, 2, reason)
}
</script>

<style scoped>
.board {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.board-header {
  text-align: center;
  margin-bottom: 30px;
}

.board-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0;
}

.board-columns {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
  flex: 1;
}

@media (max-width: 1000px) {
  .board-columns {
    flex-direction: column;
    align-items: center;
  }
}
</style>