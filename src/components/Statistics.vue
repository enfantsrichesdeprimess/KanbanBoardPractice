<template>
  <div class="statistics-panel">
    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-label">Всего задач</div>
        <div class="stat-value">{{ totalCards }}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-label">Запланировано</div>
        <div class="stat-value">{{ plannedCards }}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-label">В работе</div>
        <div class="stat-value">{{ inProgressCards }}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-label">Тестирование</div>
        <div class="stat-value">{{ testingCards }}</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-label">Выполнено</div>
        <div class="stat-value">{{ completedCards }}</div>
        <div class="stat-hint">
          <span :class="{ 'text-success': onTimeCount, 'text-danger': overdueCount }">
            {{ onTimeCount }} в срок / {{ overdueCount }} просрочено
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useKanbanStore } from '@/stores/kanbanStore'

const store = useKanbanStore()

const totalCards = computed(() => {
  return store.columns.reduce((sum, col) => sum + col.cards.length, 0)
})

const plannedCards = computed(() => store.columns[0]?.cards.length || 0)
const inProgressCards = computed(() => store.columns[1]?.cards.length || 0)
const testingCards = computed(() => store.columns[2]?.cards.length || 0)
const completedCards = computed(() => store.columns[3]?.cards.length || 0)

const onTimeCount = computed(() => {
  return store.columns[3]?.cards.filter(card => !store.checkDeadline(card)).length || 0
})

const overdueCount = computed(() => {
  return store.columns[3]?.cards.filter(card => store.checkDeadline(card)).length || 0
})
</script>

<style scoped>
.statistics-panel {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  justify-content: center;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  min-width: 150px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #868e96;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.stat-value {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}

.stat-hint {
  font-size: 0.75rem;
  margin-top: 4px;
}

.text-success {
  color: #40c057;
}

.text-danger {
  color: #fa5252;
}

@media (max-width: 768px) {
  .stat-card {
    min-width: 120px;
    padding: 8px 12px;
  }

  .stat-value {
    font-size: 1.2rem;
  }
}
</style>