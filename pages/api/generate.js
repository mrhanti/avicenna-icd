import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generate(req.body.entries, req.body.gender, req.body.age),
    temperature: 0.9,
    max_tokens: 4000,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
  });
  res.status(200).json({ result: toResponse(completion) });
}

function toResponse(completion) {
  const result = sanitize(completion.data.choices[0].text);
  try {
    return JSON.parse(result);
  } catch (err) {
    return result;
  }
}

function sanitize(str) {
  return str.replace(/(\n|\t)*/g, "");
}

function generate(entries, gender, age) {
  const prompt = `
    List ICD-10 codes for a ${age}-year-old ${gender} with ${entries} in clean JSON array of objects with \"id\" as UUID and \"code\" and \"desc\" as object keys
  `;
  return prompt;
}
