<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>{{ card ? 'Редактировать карточку' : 'Создать карточку' }}</h2>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>Заголовок *</label>
          <input
              v-model="form.title"
              type="text"
              required
              placeholder="Введите заголовок"
          />
        </div>

        <div class="form-group">
          <label>Описание</label>
          <textarea
              v-model="form.description"
              rows="3"
              placeholder="Введите описание задачи"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Пункты выполнения (мкасимум - 3)</label>
          <div class="checklist-inputs">
            <div
                v-for="(item, index) in form.checklist"
                :key="index"
                class="checklist-input-item"
            >
              <input
                  v-model="item.text"
                  type="text"
                  :placeholder="`Пункт ${index + 1}`"
                  class="checklist-input"
              />
              <button
                  v-if="form.checklist.length > 1"
                  type="button"
                  class="remove-item-btn"
                  @click="removeChecklistItem(index)"
                  title="Удалить пункт"
              >
                ✕
              </button>
            </div>

            <button
                v-if="form.checklist.length < 3"
                type="button"
                class="add-item-btn"
                @click="addChecklistItem"
            >
              + Добавить пункт
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Дедлайн *</label>
          <input
              v-model="form.deadline"
              type="datetime-local"
              required
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Отмена
          </button>
          <button type="submit" class="submit-btn">
            {{ card ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  title: '',
  description: '',
  checklist: [{ text: '', completed: false }],
  deadline: ''
})

watch(() => props.card, (newCard) => {
  if (newCard) {
    form.value = {
      title: newCard.title || '',
      description: newCard.description || '',
      checklist: newCard.checklist && newCard.checklist.length
          ? newCard.checklist.map(item => ({ text: item.text, completed: item.completed }))
          : [{ text: '', completed: false }],
      deadline: newCard.deadline ? new Date(newCard.deadline).toISOString().slice(0, 16) : ''
    }
  } else {
    form.value = {
      title: '',
      description: '',
      checklist: [{ text: '', completed: false }],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    }
  }
}, { immediate: true })

const addChecklistItem = () => {
  if (form.value.checklist.length < 3) {
    form.value.checklist.push({ text: '', completed: false })
  }
}

const removeChecklistItem = (index) => {
  if (form.value.checklist.length > 1) {
    form.value.checklist.splice(index, 1)
  }
}

const onSubmit = () => {
  if (!form.value.title.trim()) {
    alert('Заголовок обязателен')
    return
  }

  const checklist = form.value.checklist
      .filter(item => item.text.trim())
      .map(item => ({
        text: item.text.trim(),
        completed: item.completed || false
      }))

  emit('save', {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    checklist: checklist.length ? checklist : null,
    deadline: form.value.deadline
  })

  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.checklist-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checklist-input-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.checklist-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.95rem;
}

.remove-item-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: #fff5f5;
  color: #fa5252;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-item-btn:hover {
  background: #ffe3e3;
}

.add-item-btn {
  padding: 8px;
  background: #e7f5ff;
  border: 1px dashed #4c6ef5;
  border-radius: 6px;
  color: #4c6ef5;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-item-btn:hover {
  background: #d0ebff;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.cancel-btn {
  background: #e9ecef;
  color: #495057;
}

.cancel-btn:hover {
  background: #dee2e6;
}

.submit-btn {
  background: #4c6ef5;
  color: white;
}

.submit-btn:hover {
  background: #364fc7;
}
</style>