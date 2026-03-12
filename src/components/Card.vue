<template>
  <div class="card" :class="statusClass">
    <div class="card-header">
      <h3 class="card-title">{{ card.title }}</h3>
      <div class="card-actions">
        <button @click="$emit('edit', card)" class="icon-btn" title="Редактировать">✏️</button>
        <button @click="$emit('delete', card.id)" class="icon-btn" title="Удалить">🗑️</button>
      </div>
    </div>

    <p class="card-description">{{ card.description }}</p>

    <div class="card-dates">
      <div class="date-item">
        <span class="date-label">Создано:</span>
        <span class="date-value">{{ formatDate(card.createdAt) }}</span>
      </div>

      <div v-if="card.updatedAt" class="date-item">
        <span class="date-label">Изменено:</span>
        <span class="date-value">{{ formatDate(card.updatedAt) }}</span>
      </div>

      <div class="date-item" :class="{ overdue: isOverdue }">
        <span class="date-label">Дедлайн:</span>
        <span class="date-value">{{ formatDate(card.deadline) }}</span>
      </div>

      <div v-if="card.returnReason" class="return-reason">
        <span class="reason-label">Причина возврата:</span>
        <span class="reason-text">{{ card.returnReason }}</span>
      </div>
    </div>

    <div class="card-footer">
      <!-- Кнопки перемещения в зависимости от колонки -->
      <div v-if="columnId === 1" class="move-buttons">
        <button @click="moveToColumn(2)" class="move-btn">→ В работу</button>
      </div>

      <div v-else-if="columnId === 2" class="move-buttons">
        <button @click="moveToColumn(3)" class="move-btn">→ Тестирование</button>
      </div>

      <div v-else-if="columnId === 3" class="move-buttons">
        <button @click="moveToColumn(4)" class="move-btn success">→ Выполнено</button>
        <button @click="promptReturnReason" class="move-btn warning">← В работу</button>
      </div>

      <div v-else-if="columnId === 4" class="status-badge" :class="statusClass">
        {{ isOverdue ? 'Просрочено' : 'Выполнено в срок' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKanbanStore } from '@/stores/kanbanStore'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  columnId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'move', 'return-to-work'])
const store = useKanbanStore()

const isOverdue = computed(() => {
  if (props.columnId === 4) {
    return store.checkDeadline(props.card)
  }
  return false
})

const statusClass = computed(() => {
  if (props.columnId === 4) {
    return isOverdue.value ? 'overdue' : 'on-time'
  }
  return ''
})

const formatDate = (dateString) => {
  if (!dateString) return 'Нет даты'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const moveToColumn = (targetColumnId) => {
  emit('move', { cardId: props.card.id, targetColumnId })
}

const promptReturnReason = () => {
  const reason = prompt('Укажите причину возврата карточки в работу:')
  if (reason) {
    emit('return-to-work', { cardId: props.card.id, reason })
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card.overdue {
  border-left: 4px solid #fa5252;
}

.card.on-time {
  border-left: 4px solid #40c057;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.icon-btn:hover {
  opacity: 1;
}

.card-description {
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
  word-break: break-word;
}

.card-dates {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 0.85rem;
}

.date-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.date-item:last-child {
  margin-bottom: 0;
}

.date-item.overdue .date-value {
  color: #fa5252;
  font-weight: 600;
}

.date-label {
  color: #868e96;
}

.date-value {
  color: #495057;
}

.return-reason {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #dee2e6;
}

.reason-label {
  display: block;
  color: #e67700;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.reason-text {
  color: #495057;
  font-size: 0.9rem;
  font-style: italic;
}

.card-footer {
  margin-top: 12px;
}

.move-buttons {
  display: flex;
  gap: 8px;
}

.move-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.move-btn.success {
  background: #40c057;
  color: white;
}

.move-btn.success:hover {
  background: #2f9e44;
}

.move-btn.warning {
  background: #fd7e14;
  color: white;
}

.move-btn.warning:hover {
  background: #e8590c;
}

.status-badge {
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.overdue {
  background: #fff5f5;
  color: #fa5252;
}

.status-badge.on-time {
  background: #ebfbee;
  color: #40c057;
}
</style>