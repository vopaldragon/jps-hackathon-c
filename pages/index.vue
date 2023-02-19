<template>
  <div>
    <h1>
      <img src="/title.svg" alt="Fake Japan Search" />
    </h1>
    <p class="description">日本のあることないことを調べよう</p>
    <div class="query">
      <div class="words">
        <h2>キーワード</h2>
        <button
          :class="{ selected: currentKeyword === keyword }"
          v-for="keyword in keywords"
          @click="selectKeyword(keyword)"
        >
          {{ keyword }}
        </button>
      </div>
      <div class="cross" v-if="currentKeyword">×</div>
      <div class="words" v-if="currentKeyword">
        <h2>フェイク</h2>
        <button
          :class="{ selected: currentFake === fake }"
          v-for="fake in fakes"
          @click="selectFake(fake)"
        >
          {{ fake }}
        </button>
      </div>
      <p v-if="currentKeyword" class="description">
        ※フェイクで「シンプル」「トンデモ」を選んだ場合、検索結果のうちの一つが機械学習による嘘内容に差し替わります。
      </p>
    </div>

    <main>
      <div v-if="loading" class="loader">Loading...</div>
      <div class="search-result" v-if="result">
        <div
          class="search-item"
          :class="{ fake: showFake && item.fake }"
          v-for="item in result"
        >
          <img :src="item.fakeThumb !== '' ? item.fakeThumb : item.thumb" />
          <h3>{{ item.title }}</h3>
          <p>
            {{ description(item)
            }}<button
              v-if="item.description.length > 100"
              class="show-more"
              @click="item.show = !item.show"
            >
              {{ item.show ? "閉じる" : "もっと表示" }}
            </button>
          </p>
        </div>
      </div>
    </main>
    <div class="foot" v-show="result">
      <input type="checkbox" v-model="showFake" id="Omitooshi" />
      <label for="Omitooshi"><img src="/foot.svg" />おみとおし</label>
      <div v-if="prompt && showFake">
        <h4>フェイク生成プロンプト</h4>
        <p>{{ prompt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const result = ref<
  | {
      title: string
      description: string
      fakeDescription: string
      fake: boolean
      show: boolean
      thumb: string
      fakeThumb: string
      gen: string
    }[]
  | null
>(null)

const currentKeyword = ref("")
const currentFake = ref("")

const keywords = ref([])

const fakes = ["シンプル", "トンデモ", "プレーン"]

function selectKeyword(e: string) {
  currentKeyword.value = e
  search()
}

function selectFake(e: string) {
  currentFake.value = e
  search()
}

const loading = ref(false)

const prompt = computed((v) => {
  try {
    return result.value?.filter((v) => v["gen"]).pop()?.gen
  } catch (e) {}
  return ""
})
async function search() {
  if (currentKeyword.value && currentFake.value) {
    loading.value = true
    result.value = null
    try {
      result.value = (
        await useFetch("/api/merged", {
          method: "POST",
          body: { keyword: currentKeyword.value, fake: currentFake.value },
        })
      ).data.value
    } catch (e) {
      alert(e)
    } finally {
      loading.value = false
    }
  }
}

async function getKeywords() {
  const response: any = await $fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1ydNpNYQ1g8KAoUWUoQ_6YvgPYEk5k08XnUleNsH-n3I/values/%E6%95%B4%E5%BD%A2%E3%83%87%E3%83%BC%E3%82%BF?key=AIzaSyDNPQiu_z4xWcVUZPVRVrGhpTYMd5pFEns`
  )
  const keys = response.values.splice(0, 1)[0]
  const jsonData = response.values.map(function (row: any[]) {
    var obj = {}
    row.map(function (item, index) {
      obj[keys[index]] = item
    })
    return obj
  })
  const items = jsonData.map((item: any) => item["キーワード"])
  keywords.value = new Set(items)
}

function description(i: any) {
  const text = i.fakeDescription !== "" ? i.fakeDescription : i.description
  if (text.length > 100) {
    if (i.show) {
      return text
    } else {
      return text.substring(0, 100) + "..."
    }
  } else {
    return text
  }
}

const showFake = ref(false)

onMounted(() => {
  getKeywords()
})
</script>

<style lang="scss">
$primary: #6941a0;
h1 {
  display: flex;
  justify-content: center;
  margin-top: 8rem;
}

.description {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.query {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  .words {
    display: flex;
    gap: 1rem;
    align-items: center;
    h2 {
      font-size: 0.875rem;
    }
    button {
      cursor: pointer;
      background-color: transparent;
      border: none;
      padding: 0;
      appearance: none;
      background: none;
      font-feature-settings: "liga";
      -webkit-tap-highlight-color: transparent;

      border-radius: 9999px;

      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      line-height: 0.875rem;
      text-align: center;
      white-space: nowrap;

      display: inline-flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;

      background-color: $primary;
      color: white;
      &:not(:disabled):hover {
        background-color: darken($primary, 20%);
        color: white;
      }
      &:hover {
        transition: all 250ms;
      }
      &.selected {
        background-color: adjust-hue($primary, 180deg);
        &:hover {
          background-color: adjust-hue($primary, 180deg);
        }
      }
    }
  }

  .cross {
    font-size: 2.5rem;
  }
}
.foot {
  margin-top: 2rem;
  text-align: center;
  label {
    border-radius: 16px;
    display: block;
    margin-bottom: 2rem;
    font-weight: bold;
    border: 3px solid #d30c2f;
  }
  input[type="checkbox"] {
    position: absolute;
    white-space: nowrap;
    width: 1px;
    height: 1px;
    border: 0;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    &:checked + label {
      background: #d30c2f;
      color: white;
    }
  }
}
main {
  margin-top: 2rem;
  .search-result {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    .search-item {
      width: 16rem;
      h3 {
        margin-top: 0.5rem;
      }
      p {
        margin-top: 0.25rem;
        color: #494949;
      }
      img {
        height: 256px;
        object-fit: contain;
      }
      .show-more {
        margin-left: 1rem;
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 0;
        appearance: none;
        background: none;
        font-feature-settings: "liga";
        -webkit-tap-highlight-color: transparent;
      }
      &.fake {
        border: 1px solid $primary;
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
