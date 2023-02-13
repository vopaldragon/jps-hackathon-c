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
      // Pinned to a specific version of instruct-pix2pix
      // See https://replicate.com/timothybrooks/instruct-pix2pix/versions
      version: "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: body.prompt, image: body.image },
    }),
  }).then((response) => {
    data = response
  });

  return data;
})
