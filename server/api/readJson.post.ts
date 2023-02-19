export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const json: any = await import('~/assets/fake.json')
  const data: any[] = json.default
  const filteredData = data.filter((item: any) => {
    return item['キーワード'] === body.keyword
  })
  return filteredData;
})
