import { getRouterParams } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const params = getRouterParams(event)
  let data: unknown;
  await $fetch(
    `/predictions/${params.id}`,
    {
      baseURL: config.public.replicateApiURL,
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
    data = response
  });

  return data;
})
