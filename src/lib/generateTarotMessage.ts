import axios from "axios";

export const generateTarotMessage = async (name: string, meaning: string) => {
  const prompt = `
タロットカードの占い文言を作成してください。
カード名: ${name}
キーワード: ${meaning}

以下のようなJSON形式で正位置と逆位置の文言を生成してください:
{
  "upright": "正位置の文言",
  "reversed": "逆位置の文言"
}


`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          { role: "system", content: "あなたは占い師です。" },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const structuredOutput = JSON.parse(
      response.data.choices[0].message.content
    );
    return structuredOutput; // { upright: "正位置の文言", reversed: "逆位置の文言" }
  } catch (error) {
    console.error("文言生成エラー:", error);
    throw new Error("文言生成に失敗しました。");
  }
};
