<template>
  <div>
    <form class="formContainer" @submit.prevent="handleSubmit">
      <div>
        <input type="file" accept="image/*" @change="uploadImage" />
      </div>
      <div v-if="file.previewImage">
        <img :src="typeof file.previewImage === 'string' ? file.previewImage : ''" alt="" />
      </div>
      <div>
        <input type="text" v-model="prompt" class="inputField" />
      </div>
      <button v-if="file && prompt" type="submit">GO!</button>
    </form>

    <div v-if="state.isProcessing">
      <img src="/loading.gif" alt="now processing" />
    </div>

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

type FileType = {
  defaultName: string;
  previewImage: string | ArrayBuffer | null;
  selectedFile: {
    id: number;
    fileId: string;
    name: string;
    image: string | ArrayBuffer | null;
  }[];
};

const fileValue = {
  defaultName: "ファイルが選択されていません",
  previewImage: "",
  selectedFile: [
    {
      id: 0,
      fileId: "file_input__0",
      name: "ファイルが選択されていません",
      image: null,
    },
  ],
};

const file = ref<FileType>(fileValue);
const prompt = ref('')
const prediction = reactive<Prediction>({
  response: {}
})
const state = reactive({
  isProcessing: false
})
const error = ref('')

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms));

const handleSubmit = async () => {
  state.isProcessing = true
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt.value,
      image: file.value.previewImage,
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
  state.isProcessing = false
};

const uploadImage = (e: any) => {
  const files = e.target.files
  const image = files[0]
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = () => {
    file.value.selectedFile[0].name = image.name;
    file.value.selectedFile[0].image = reader.result;
    file.value.previewImage = file.value.selectedFile[0].image;
  };
};
</script>

<style lang="scss">
.formContainer {
  margin-bottom: 20px;
}
.inputField {
  display: block;
  width: 80%;
  padding: 8px;
}
img {
  max-width: 100%;
  height: auto;
  vertical-align: bottom;
}
</style>
