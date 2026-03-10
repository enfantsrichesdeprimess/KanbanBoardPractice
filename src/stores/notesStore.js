import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotesStore = defineStore('notes', () => {
    const columns = ref([
        {
            id: 1,
            maxCards: 3,
            cards: [
                {
                    id: 1,
                    cardTitle: 'План на сегодня',
                    points: [
                        { id: 1, title: 'Позавтракать', isReady: false },
                        { id: 2, title: 'Сделать зарядку', isReady: true },
                        { id: 3, title: 'Почитать книгу', isReady: false }
                    ],
                    completedAt: null
                }
            ]
        },
        {
            id: 2,
            maxCards: 5,
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
                    ],
                    completedAt: null
                }
            ]
        },
        {
            id: 3,
            maxCards: Infinity,
            cards: []
        }
    ])

    const isColumn1Locked = computed(() => {
        const column2 = columns.value.find(c => c.id === 2)
        return column2 && column2.cards.length >= column2.maxCards
    })

    const getCompletionPercent = (card) => {
        if (!card.points.length) return 0
        const completed = card.points.filter(p => p.isReady).length
        return Math.round((completed / card.points.length) * 100)
    }

    const findCard = (cardId) => {
        for (const column of columns.value) {
            const cardIndex = column.cards.findIndex(c => c.id === cardId)
            if (cardIndex !== -1) {
                return { column, card: column.cards[cardIndex], cardIndex }
            }
        }
        return null
    }

    const moveCard = (card, fromColumnId, toColumnId) => {
        const fromColumn = columns.value.find(c => c.id === fromColumnId)
        const toColumn = columns.value.find(c => c.id === toColumnId)

        if (!fromColumn || !toColumn) return false

        const cardIndex = fromColumn.cards.findIndex(c => c.id === card.id)
        if (cardIndex === -1) return false

        fromColumn.cards.splice(cardIndex, 1)
        toColumn.cards.push(card)

        console.log(`Карточка "${card.cardTitle}" перемещена из колонки ${fromColumnId} в колонку ${toColumnId}`)
        return true
    }

    // Проверяем и перемещаем карточку если нужно
    const checkAndMoveCard = (cardId) => {
        const found = findCard(cardId)
        if (!found) return

        const { column, card } = found
        const percent = getCompletionPercent(card)

        if (column.id === 3) return

        if (percent === 100 && column.id !== 3) {
            card.completedAt = new Date().toISOString()
            moveCard(card, column.id, 3)
            return
        }

        if (percent > 50 && column.id === 1) {
            if (!isColumn1Locked.value) {
                moveCard(card, 1, 2)
            } else {
                console.log('Первая колонка заблокирована, карточка остаётся на месте')
            }
            return
        }
    }

    const togglePoint = (cardId, pointId) => {
        const found = findCard(cardId)
        if (!found) return

        const { column, card } = found

        if (column.id === 1 && isColumn1Locked.value) {
            console.log(' Нельзя редактировать карточки в заблокированной колонке')
            return
        }

        const point = card.points.find(p => p.id === pointId)
        if (!point) return

        point.isReady = !point.isReady
        console.log(`Пункт ${pointId} в карточке ${cardId} теперь:`, point.isReady)
        checkAndMoveCard(cardId)
    }

    const logStore = () => {
        console.log('Состояние store:')
        console.log(`Первая колонка ${isColumn1Locked.value ? 'ЗАБЛОКИРОВАНА' : 'доступна'}`)
        columns.value.forEach(col => {
            console.log(`Колонка ${col.id}: ${col.cards.length}/${col.maxCards === Infinity ? '∞' : col.maxCards} карточек`)
            col.cards.forEach(card => {
                const percent = getCompletionPercent(card)
                console.log(`  "${card.cardTitle}" - ${percent}% ${card.completedAt ? '(завершена)' : ''}`)
            })
        })
    }

    return { columns, togglePoint, logStore, isColumn1Locked }
})