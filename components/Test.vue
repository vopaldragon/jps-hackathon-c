<template>
  <div>
    <div>TestComp2</div>
    <div>{{ p }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ p: string }>()
</script>
