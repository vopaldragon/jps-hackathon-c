import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: body.input,
        temperature: 0,
        max_tokens: 356,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0,
    })
    console.info(event, response);
    return response.data.choices[0].text || ""
})