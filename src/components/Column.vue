<template>
  <div class="column">
    <h2>Колонка {{ columnId }}</h2>
  </div>
</template>

<script setup>
defineProps({
  columnId: Number,
})
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.column {
  flex: 1;
  min-height: 400px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.column h2 {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 1.2rem;
}
</style>