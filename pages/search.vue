<template>
  <div>
    <div class="search">
      <form @submit.prevent="search">
        <input v-model="keyword" />
        <button type="submit">検索</button>
      </form>
    </div>
    <main>
      <div v-if="loading" class="loader">Loading...</div>
      <div class="search-result" v-if="result">
        <table>
          <thead>
            <tr class="search-item">
              <th></th>
              <th>タイトル</th>
              <th>解説</th>
              <th>DB</th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            <tr class="search-item" v-for="item in result">
              <td>
                <img :src="item.common.thumbnailUrl[0]" />
              </td>
              <td>{{ item.common.title }}</td>
              <td>{{ item.common.description }}</td>
              <td>{{ item.common.database }}</td>
              <td>
                <a target="_blank" :href="item.common.linkUrl">🔗</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const result = ref<any[] | null>(null)

const keyword = ref("")
const era = ref("")

const loading = ref(false)

async function search() {
  loading.value = true
  try {
    result.value = null
    const r1 = (await $fetch(
      `https://jpsearch.go.jp/api/item/search/jps-cross`,
      {
        method: "get",
        query: {
          keyword: keyword.value,
          "f-contents": ["thumb"],
          exists: ["common.description"],
          size: 100,
        },
      }
    )) as any
    const db: { [key: string]: number } = {}
    const r2 = []
    for (let item of r1.list) {
      if (item.common.description.length < 200) continue
      if (db[item.common.database] > 3) continue
      r2.push(item)
      db[item.common.database] = db[item.common.database]
        ? db[item.common.database] + 1
        : 1
    }
    result.value = r2
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

if (route.query["keyword"]) {
  keyword.value = route.query["keyword"] as string
  await search()
}
</script>

<style lang="scss">
$primary: #6941a0;

.search {
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  align-items: center;
  input {
    width: 20rem;
  }
}

h1 {
  display: flex;
  justify-content: center;
}

.description {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

main {
  margin-top: 2rem;

  .search-result {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    table {
      border-collapse: collapse;
    }
    .search-item {
      width: 16rem;
      img {
        object-fit: contain;
        min-width: 128px;
      }
      td {
        padding: 1rem;
        border-bottom: 1px solid grey;
      }
    }
  }
  .loader {
    color: $primary;
    font-size: 60px;
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin: 72px auto;
    position: relative;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
    animation: load6 1.7s infinite ease, round 1.7s infinite ease;
  }
  @-webkit-keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
        -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
        -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
        -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
        -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
        -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
        -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
        -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
        -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
        -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
        -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
        -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
        -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @-webkit-keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}

.foot {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
