import { SearchResult } from "~~/domain/item"

import { Configuration, OpenAIApi } from "openai"

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


export default defineEventHandler(async (event): Promise<SearchResult> => {
    const body = await readBody(event)
    const response = await $fetch(`https://jpsearch.go.jp/api/item/search/jps-cross`, {
        method: 'get',
        query: {
            keyword: body.keyword,
            "f-contents": ["thumb"],
            size: 10
        }

    }) as SearchResult

    response.list[3]

    const desc = await genGpt("Q:" + response.list[3].common.title + "の特徴は？")
    response.list[3].common.description = desc.replace(/^A: /, "")
    return response
})