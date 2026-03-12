import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'kanban-data'

export const useKanbanStore = defineStore('kanban', () => {
    const loadInitialData = () => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch (e) {
                console.error('Ошибка загрузки данных:', e)
            }
        }

        return [
            {
                id: 1,
                title: 'Запланированные задачи',
                cards: [
                    {
                        id: 1,
                        title: 'Пример задачи',
                        description: 'Описание задачи',
                        createdAt: new Date().toISOString(),
                        updatedAt: null,
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'planned'
                    }
                ]
            },
            {
                id: 2,
                title: 'Задачи в работе',
                cards: []
            },
            {
                id: 3,
                title: 'Тестирование',
                cards: []
            },
            {
                id: 4,
                title: 'Выполненные задачи',
                cards: []
            }
        ]
    }

    const columns = ref(loadInitialData())

    const createCard = (cardData) => {
        const newCard = {
            id: Date.now(),
            ...cardData,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            status: 'planned'
        }

        columns.value[0].cards.push(newCard)
    }

    const updateCard = (cardId, updates) => {
        for (const column of columns.value) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                column.cards[cardIndex] = {
                    ...column.cards[cardIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                break
            }
        }
    }

    const deleteCard = (cardId) => {
        for (const column of columns.value) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                column.cards.splice(cardIndex, 1)
                break
            }
        }
    }

    const moveCard = (cardId, targetColumnId, returnReason = null) => {
        let cardToMove = null
        let sourceColumn = null

        for (const column of columns.value) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                cardToMove = column.cards[cardIndex]
                sourceColumn = column
                column.cards.splice(cardIndex, 1)
                break
            }
        }

        if (!cardToMove) return

        if (returnReason) {
            cardToMove.returnReason = returnReason
        }

        const targetColumn = columns.value.find(c => c.id === targetColumnId)
        if (targetColumn) {
            targetColumn.cards.push(cardToMove)
        }
    }

    const checkDeadline = (card) => {
        if (!card.deadline) return false
        const now = new Date()
        const deadline = new Date(card.deadline)
        return now > deadline
    }

    const saveToLocalStorage = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns.value))
    }
    const updateChecklist = (cardId, checklist) => {
        for (const column of columns.value) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                column.cards[cardIndex] = {
                    ...column.cards[cardIndex],
                    checklist,
                    updatedAt: new Date().toISOString()
                }
                break
            }
        }
    }

    watch(columns, () => {
        saveToLocalStorage()
    }, { deep: true })

    return {
        columns,
        createCard,
        updateCard,
        deleteCard,
        moveCard,
        checkDeadline,
        updateChecklist
    }
})