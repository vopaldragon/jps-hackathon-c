import { Item } from "~~/server/api/readJson.post"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const originalResponse: any = await $fetch("/api/jpsearch", {
    method: "POST",
    body: { keyword: body.keyword },
  })

  const fakeResponse: any = await $fetch("/api/readJson", {
    method: "POST",
    body: { keyword: body.keyword, fake: body.fake },
  })

  const mergedResponse: any = originalResponse.map((item: Item) => {
    const fakeItem = fakeResponse.find((v: { id: string }) => v.id === item.id)
    if (fakeItem) {
      return {
        ...item,
        fake: true,
        fakeDescription: fakeItem.fakeDescription,
        fakeThumb: fakeItem.fakeThumb,
        gen: fakeItem.gen
      }
    } else {
      return item
    }
  })

  return mergedResponse;
})
