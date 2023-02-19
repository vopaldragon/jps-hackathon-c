import {Item} from '~/server/api/search'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response: any = await $fetch(
    `https://jpsearch.go.jp/api/item/search/jps-cross`,
    {
      method: "get",
      query: {
        keyword: body.keyword,
        "f-contents": ["thumb"],
        exists: ["common.description"],
        size: 100,
      },
    }
  )

  const result: Item[] = response.list?.map((i: {
    id: string;
    common: { title: string; description: string; thumbnailUrl: string[] } }) => {
    return {
      id: i.id,
      title: i.common.title,
      description: i.common.description,
      fakeDescription: '',
      show: false,
      fake: false,
      thumb: i.common.thumbnailUrl ? i.common.thumbnailUrl[0] : "",
      fakeThumb: ''
    }
  })

  return result;
})
