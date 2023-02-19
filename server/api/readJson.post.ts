import {Item} from '~/server/api/search'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const response: any = await $fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1ydNpNYQ1g8KAoUWUoQ_6YvgPYEk5k08XnUleNsH-n3I/values/%E6%95%B4%E5%BD%A2%E3%83%87%E3%83%BC%E3%82%BF?key=AIzaSyDNPQiu_z4xWcVUZPVRVrGhpTYMd5pFEns`,
  )
  const keys = response.values.splice(0, 1)[0];
  const jsonData = response.values.map(function(row: any[]) {
    var obj = {}
    row.map(function(item, index) {
      obj[keys[index]] = item;
    });
    return obj;
  });
  const result: Item[] = jsonData.filter((item: any) => item['キーワード'] === body.keyword && item['フェイク'] === body.fake).map((i: { common: { title: string; description: string; thumbnailUrl: string[] } }) => {
    return {
      id: i['JPSID'] ?? '',
      title: '',
      description: '',
      fakeDescription: i['フェイク解説'] ?? '',
      show: false,
      fake: true,
      thumb: '',
      fakeThumb: i['画像'] ?? ''
    }
  })
  return result
})
