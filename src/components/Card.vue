<!-- src/components/Card.vue -->
<template>
  <div class="card">
    <h3 class="card-title">{{ cardTitle }}</h3>
    <ul>
      <li v-for="point in points" :key="point.id">
        {{ point.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  cardTitle: String,
  points: Array,
  id: Number,
})
</script>

<style scoped>
.card {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #444;
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  color: #666;
  margin: 5px 0;
}
</style>