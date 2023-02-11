<template>
  <div>
    <textarea v-model="q"></textarea>
    <textarea v-model="answer"></textarea>
    <button @click="run()">RUN</button>
  </div>
</template>

<script setup lang="ts">
const q = ref("")
const answer = ref("")

const run = async () => {
  let a = await useFetch("/api/gpt3", {
    method: "POST",
    body: { input: q.value },
  })
  answer.value = a.data.value || ""
}
</script>
