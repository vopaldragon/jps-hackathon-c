export type Item = {
  id: string;
  title: string;
  description: string;
  fakeDescription: string;
  fake: boolean;
  thumb: string;
  fakeThumb: string;
}
import json from "public/data.json"
const keys = json.values.splice(0, 1)[0];
const jsonData = json.values.map(function (row: any[]) {
  var obj: any = {}
  row.map(function (item, index) {
    obj[keys[index]] = item;
  });
  return obj;
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result: Item[] = JSON.parse(JSON.stringify(jsonData)).filter((item: any) => item['キーワード'] === body.keyword && item['フェイク'] === body.fake).map((i: any) => {
    return {
      id: i['JPSID'] ?? '',
      title: '',
      description: '',
      fakeDescription: i['フェイク解説'] ?? '',
      gen: i['生成文'] ?? '',
      show: false,
      fake: true,
      thumb: '',
      fakeThumb: i['画像'] ?? ''
    }
  })
  return result
})
