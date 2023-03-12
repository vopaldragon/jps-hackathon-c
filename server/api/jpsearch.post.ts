import { Item } from "~~/server/api/readJson.post"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const r1 = (await $fetch(
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
  ))

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

  const result: Item[] = r2.map((i: {
    id: string;
    common: { title: string; description: string; thumbnailUrl: string[] }
  }) => {
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
