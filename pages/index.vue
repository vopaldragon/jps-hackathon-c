<template>
  <div>
    <form @submit.prevent="search()">
      <input type="text" v-model="q" /><button type="submit">検索</button>
    </form>

    <div class="search-result" v-if="result">
      <div class="search-item" v-for="item in result.list">
        <img :src="item.common.thumbnailUrl[0]" />
        <h3>{{ item.common.title }}</h3>
        <p>{{ item.common.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchResult } from "@/domain/item"

const q = ref("")
const answer = ref("")
const result = ref<SearchResult>()

const search = async () => {
  result.value = (
    await useFetch("/api/search", {
      method: "POST",
      body: { keyword: q.value },
    })
  ).data.value as any
}

const run = async () => {
  let a = await useFetch("/api/gpt3", {
    method: "POST",
    body: { input: q.value },
  })
  answer.value = a.data.value || ""
}
</script>

<style lang="scss">
.search-result {
  display: flex;
  flex-wrap: wrap;
  .search-item {
    width: 16rem;
  }
}
</style>
