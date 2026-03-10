// src/stores/notesStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotesStore = defineStore('notes', () => {
    const columns = ref([
        {
            id: 1,
            cards: [
                {
                    id: 1,
                    cardTitle: 'План на сегодня',
                    points: [
                        { id: 1, title: 'Позавтракать', isReady: false },
                        { id: 2, title: 'Сделать зарядку', isReady: true },
                        { id: 3, title: 'Почитать книгу', isReady: false }
                    ]
                }
            ]
        },
        {
            id: 2,
            cards: [
                {
                    id: 2,
                    cardTitle: 'Список покупок',
                    points: [
                        { id: 4, title: 'Молоко', isReady: false },
                        { id: 5, title: 'Хлеб', isReady: true },
                        { id: 6, title: 'Яйца', isReady: false },
                        { id: 7, title: 'Сыр', isReady: false },
                        { id: 8, title: 'Помидоры', isReady: false }
                    ]
                }
            ]
        },
        { id: 3, cards: [] }
    ])

    const logStore = () => {
        console.log('Состояние store:')
        columns.value.forEach(col => {
            console.log(`Колонка ${col.id}: ${col.cards.length} карточек`)
        })
    }

    return { columns, logStore }
})