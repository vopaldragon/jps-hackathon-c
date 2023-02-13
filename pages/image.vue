<template>
  <div>
    <form class="formContainer" @submit.prevent="handleSubmit">
      <input type="text" v-model="prompt" class="inputField" />
      <button type="submit">GO!</button>
    </form>

    <div v-if="prediction.response.output && prediction.response.output.length > 0">
      <img :src="prediction.response.output[prediction.response.output.length - 1]" alt="output" />
      <p>{{ prediction.response.status }}</p>
    </div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
type Prediction = {
  response: any
}

const prompt = ref('')
const prediction = reactive<Prediction>({
  response: {}
})
const error = ref('')

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));

const handleSubmit = async () => {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt.value,
    }),
  }).then(res => res.json());
  if (response.status !== "succeeded" &&
      response.status !== "failed") {
    error.value = response.error
  }
  prediction.response = response

  while (
      prediction.response.status !== "succeeded" &&
      prediction.response.status !== "failed"
      ) {
    await sleep(1000);
    const response = await fetch("/api/predictions/" + prediction.response.id).then(res => res.json());
    if (response.status !== "succeeded" &&
        response.status !== "failed") {
      error.value = response.error
    }
    prediction.response = response
  }
};
</script>

<style lang="scss">
.formContainer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.inputField {
  flex: 1 1 auto;
  padding: 8px;
}
</style>
