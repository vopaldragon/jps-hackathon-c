<template>
  <div>
    <h1>
      <img src="/title.png" alt="Fake Japan Search" />
    </h1>
    <p class="description">日本のあることないことを調べよう</p>
    <div class="query">
      <div class="words">
        <h2>時代</h2>
        <button
          :class="{ selected: currentEra === era }"
          v-for="era in eras"
          @click="selectEra(era)"
        >
          {{ era }}
        </button>
      </div>
      <div class="cross" v-if="currentEra">×</div>
      <div class="words" v-if="currentEra">
        <h2>キーワード</h2>
        <button
          :class="{ selected: currentKeyword === keyword }"
          v-for="keyword in keywords[currentEra]"
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
    </div>

    <main>
      <div v-if="loading" class="loader">Loading...</div>
      <div class="search-result" v-if="result">
        <div
          class="search-item"
          :class="{ fake: showFake && item.fake }"
          v-for="item in result"
        >
          <img :src="item.thumb" />
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
      <label><input type="checkbox" v-model="showFake" />おみとおし</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const result = ref<
  | {
      title: string
      description: string
      fake: boolean
      show: boolean
      thumb: string
    }[]
  | null
>(null)

const eras = [
  "縄文・弥生・古墳",
  "飛鳥",
  "奈良",
  "平安",
  "鎌倉",
  "室町",
  "安土桃山",
  "江戸",
  "明治",
  "大正",
  "昭和",
  "平成",
]

const currentEra = ref("")
const currentKeyword = ref("")
const currentFake = ref("")

const keywords: { [key: string]: string[] } = {
  "縄文・弥生・古墳": ["古墳", "埴輪", "縄文土器"],
  飛鳥: ["A", "B", "C"],
}

const fakes = ["シンプル", "トンデモ", "プレーン"]

function selectEra(e: string) {
  currentEra.value = e
  currentKeyword.value = ""
}

function selectKeyword(e: string) {
  currentKeyword.value = e
  search()
}

function selectFake(e: string) {
  currentFake.value = e
  search()
}

const loading = ref(false)

async function search() {
  if (currentKeyword.value && currentFake.value) {
    loading.value = true
    result.value = null
    try {
      result.value = (
        await useFetch("/api/search", {
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

function description(i: any) {
  if (i.description.length > 100) {
    if (i.show) {
      return i.description
    } else {
      return i.description.substring(0, 100) + "..."
    }
  } else {
    return i.description
  }
}

const showFake = ref(false)
</script>

<style lang="scss">
$primary: #6941a0;
h1 {
  display: flex;
  justify-content: center;
}

.description {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.query {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  .words {
    display: flex;
    gap: 1rem;
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
      padding: 0.25rem 0.75rem;
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
    font-size: 1.5rem;
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
