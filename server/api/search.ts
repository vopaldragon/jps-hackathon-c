import { Configuration, OpenAIApi } from "openai"
const config = useRuntimeConfig()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

const genGpt = async (prompt: string) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        max_tokens: 356,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    })
    return response.data.choices[0].text || ""
}

export type Item = {
    title: string;
    description: string;
    fake: boolean;
    thumb: string;
}


export default defineEventHandler(async (event): Promise<Item[]> => {
    const body: { keyword: string, fake: string } = await readBody(event)
    console.info(body);
    const response: any = await $fetch(`https://jpsearch.go.jp/api/item/search/jps-cross`, {
        method: 'get',
        query: {
            keyword: body.keyword,
            "f-contents": ["thumb"],
            exists: ["common.description"],
            size: 8
        }
    })

    const result: Item[] = response.list?.map((i: { common: { title: string; description: string; thumbnailUrl: string[] } }) => {
        return {
            title: i.common.title,
            description: i.common.description,
            show: false,
            fake: false,
            thumb: i.common.thumbnailUrl ? i.common.thumbnailUrl[0] : ""
        }
    })

    try {
        if (body.fake === "シンプル") {
            const i = Math.floor(Math.random() * result.length);
            result[i].description = await genGpt(result[i].title + "の特徴を500文字で説明してください")
            result[i].description = result[i].description.replace(/A:/, "")
            result[i].fake = true
        } else if (body.fake === "トンデモ") {
            const i = Math.floor(Math.random() * result.length);
            //説明
            result[i].description = await genGpt("次の説明文を、必ず「超大陸の古代文明」と「宇宙人」そして「秘密結社」が起源であるとする話で終わるように、500字で書き換えてください。" + result[i].description);

            //画像
            const res: any = await $fetch("/predictions", {
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
                    input: { prompt: "make it into cyborg", image: result[i].thumb },
                }),
            })
            console.info(res);
            if (res.output.length > 0) {
                result[i].thumb = res.output[res.output.length - 1]
            }

            result[i].fake = true
        }
    } catch (e) {
        console.error(e)
    }

    return result;
})