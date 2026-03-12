<template>
  <div
      class="column"
      @dragover.prevent
      @drop="onDrop"
  >
    <div class="column-header">
      <h2>{{ column.title }}</h2>
      <span class="card-count">{{ column.cards.length }}</span>
    </div>

    <div class="cards-container">
      <div
          v-for="card in column.cards"
          :key="card.id"
          class="card-wrapper"
          draggable="true"
          @dragstart="onDragStart($event, card)"
          @dragend="onDragEnd"
      >
        <Card
            :card="card"
            :column-id="column.id"
            @edit="$emit('edit-card', card)"
            @delete="$emit('delete-card', card.id)"
            @move="onMoveCard"
            @return-to-work="$emit('return-to-work', $event)"
            @update-checklist="$emit('update-checklist', $event)"
        />
      </div>

      <div v-if="!column.cards.length" class="empty-state">
        <p>Нет карточек</p>
      </div>
    </div>

    <button
        v-if="column.id === 1"
        class="add-button"
        @click="$emit('create-card')"
    >
      + Создать карточку
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  column: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['create-card', 'edit-card', 'delete-card', 'move-card', 'return-to-work'])

const draggedCard = ref(null)

const onDragStart = (event, card) => {
  draggedCard.value = card
  event.dataTransfer.setData('text/plain', JSON.stringify({
    cardId: card.id,
    fromColumnId: props.column.id
  }))
  event.target.classList.add('dragging')
}

const onDragEnd = (event) => {
  event.target.classList.remove('dragging')
  draggedCard.value = null
}

const onDrop = (event) => {
  event.preventDefault()

  const data = JSON.parse(event.dataTransfer.getData('text/plain'))

  if (data.fromColumnId === props.column.id) return

  if (data.fromColumnId === 1 && props.column.id === 2) {
    emit('move-card', { cardId: data.cardId, targetColumnId: props.column.id })
  } else if (data.fromColumnId === 2 && props.column.id === 3) {
    emit('move-card', { cardId: data.cardId, targetColumnId: props.column.id })
  } else if (data.fromColumnId === 3 && props.column.id === 4) {
    emit('move-card', { cardId: data.cardId, targetColumnId: props.column.id })
  } else {
    alert('Невозможно переместить карточку напрямую')
  }
}

const onMoveCard = ({ cardId, targetColumnId }) => {
  emit('move-card', { cardId, targetColumnId })
}
</script>

<style scoped>
.column {
  min-width: 300px;
  background: #f8f9fa;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 150px);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
}

.column-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
}

.card-count {
  background: #dee2e6;
  color: #495057;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.cards-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  padding: 4px;
}

.empty-state {
  text-align: center;
  color: #adb5bd;
  padding: 32px 16px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.add-button {
  margin-top: 16px;
  padding: 12px;
  background: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.add-button:hover {
  background: #364fc7;
}

.card-wrapper.dragging {
  opacity: 0.5;
}

.column {
  /* ... существующие стили ... */
  transition: background-color 0.2s;
}

.column[draggable="true"] {
  cursor: grab;
}

</style>