<template>
  <div class="card" :class="{ locked: isLocked }">
    <h3 class="card-title">{{ cardTitle }}</h3>

    <ul class="points-list">
      <li
          v-for="point in points"
          :key="point.id"
          class="point-item"
          :class="{ completed: point.isReady }"
      >
        <input
            type="checkbox"
            :checked="point.isReady"
            @change="togglePoint(point.id)"
            class="point-checkbox"
            :disabled="isLocked"
        />
        <span class="point-text">{{ point.title }}</span>
      </li>
    </ul>

    <div class="progress-section">
      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: `${completionPercent}%` }"
        ></div>
      </div>
      <span class="progress-percent">{{ completionPercent }}%</span>
    </div>

    <div v-if="completedAt" class="completion-badge">
      <span class="completion-icon">✅</span>
      <span class="completion-date">{{ formatDate(completedAt) }}</span>
    </div>

    <div v-if="isLocked" class="lock-overlay">
      <span class="lock-text">Колонка заблокирована</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notesStore'

const props = defineProps({
  cardTitle: String,
  points: Array,
  id: Number,
  completedAt: [String, null],
  isLocked: Boolean
})

const store = useNotesStore()

const completionPercent = computed(() => {
  if (!props.points.length) return 0
  const completed = props.points.filter(p => p.isReady).length
  return Math.round((completed / props.points.length) * 100)
})

const togglePoint = (pointId) => {
  if (props.isLocked) return
  store.togglePoint(props.id, pointId)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card.locked {
  opacity: 0.75;
  background: #f8f9fa;
  border-color: #ffa8a8;
}

.card-title {
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f3f5;
}

.points-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.point-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed #f1f3f5;
  transition: opacity 0.2s;
}

.point-item:last-child {
  border-bottom: none;
}

.point-item.completed .point-text {
  color: #adb5bd;
  text-decoration: line-through;
}

.point-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #40c057;
  transition: transform 0.2s;
}

.point-checkbox:hover {
  transform: scale(1.1);
}

.point-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.point-text {
  flex: 1;
  color: #495057;
  font-size: 1rem;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #40c057, #82c91e);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
}

.progress-percent {
  font-size: 0.9rem;
  font-weight: 600;
  color: #40c057;
  min-width: 45px;
  text-align: right;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #ebfbee;
  border-radius: 8px;
  border: 1px solid #b2f2bb;
  margin-top: 12px;
}

.completion-icon {
  font-size: 1.2rem;
}

.completion-date {
  color: #2b8a3e;
  font-size: 0.85rem;
  font-weight: 500;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.card.locked .lock-overlay {
  opacity: 1;
  pointer-events: all;
}

.lock-text {
  color: #c92a2a;
  font-size: 0.9rem;
  font-weight: 500;
  background: white;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>