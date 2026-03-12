<script setup>
import KanbanBoard from "@/components/KanbanBoard.vue";
</script>

<template>
  <div class="app">
    <KanbanBoard />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: 100vh;
}
</style>