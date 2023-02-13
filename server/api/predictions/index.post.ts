export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  let data: unknown;
  await $fetch("/predictions", {
    baseURL: config.public.replicateApiURL,
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: body.prompt },
    }),
  }).then((response) => {
    data = response
  });

  return data;
})
