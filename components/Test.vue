<template>
  <div>
    <div>TestComp</div>
    <div>{{ p }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ p: string }>()
</script>
