<template>
  <div class="column" :class="{ locked: isLocked }">
    <div class="column-header">
      <h2>
        Колонка {{ columnId }}
        <span v-if="isLocked" class="lock-badge">Заблокировано</span>
      </h2>
      <span class="card-count">{{ cards.length }} / {{ maxCards }}</span>
    </div>

    <div class="cards-container">
      <Card
          v-for="card in cards"
          :key="card.id"
          :id="card.id"
          :card-title="card.cardTitle"
          :points="card.points"
          :completed-at="card.completedAt"
          :is-locked="isLocked && columnId === 1"
      />

      <div v-if="!cards.length" class="empty-message">
        Нет карточек
      </div>
    </div>

    <div v-if="isLocked && columnId === 1" class="lock-message">
      Колонка заблокирована до освобождения места во 2 колонке
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notesStore'
import Card from './Card.vue'

const props = defineProps({
  columnId: {
    type: Number,
    required: true
  }
})

const store = useNotesStore()

const column = computed(() => {
  return store.columns.find(col => col.id === props.columnId)
})

const cards = computed(() => column.value?.cards || [])
const maxCards = computed(() => {
  const limit = column.value?.maxCards
  return limit === Infinity ? '∞' : limit
})

const isLocked = computed(() => {
  return props.columnId === 1 && store.isColumn1Locked
})
</script>

<style scoped>
.column {
  flex: 1;
  min-width: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.column.locked {
  opacity: 0.8;
  background: #f1f3f5;
  border: 2px solid #ff6b6b;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.column-header h2 {
  margin: 0;
  color: #495057;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lock-badge {
  font-size: 1rem;
}

.card-count {
  background: #dee2e6;
  color: #495057;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.cards-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-message {
  text-align: center;
  color: #adb5bd;
  font-style: italic;
  padding: 40px 20px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.lock-message {
  margin-top: 16px;
  padding: 12px;
  background: #fff3f3;
  border: 1px solid #ffa8a8;
  border-radius: 6px;
  color: #c92a2a;
  font-size: 0.9rem;
  text-align: center;
}
</style>