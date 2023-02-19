import {Item} from '~/server/api/search'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const originalResponse: any = await $fetch("/api/jpsearch", {
    method: "POST",
    body: { keyword: body.keyword },
  })

  const fakeResponse: any = await $fetch("/api/readJson", {
    method: "POST",
    body: { keyword: body.keyword },
  })

  const mergedResponse: any = [...originalResponse, ...fakeResponse]

  return mergedResponse;
})
