import axios from "axios";

interface TarotResponse {
  upright: string;
  reversed: string;
}

export const generateTarotMessage = async (name: string, meaning: string) => {
  const prompt = `
あなたはタロットカード占い師です。

タロットカード「${name}」に基づいて正位置と逆位置の文言を生成してください。
キーワード: ${meaning}
`;

  const geminiApiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent";
  const schema = {
    description: "タロットカードの正位置と逆位置の文言を生成する",
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        upright: {
          type: "string",
          description: "タロットカードの正位置の文言",
        },
        reversed: {
          type: "string",
          description: "タロットカードの逆位置の文言",
        },
      },
      required: ["upright", "reversed"],
    },
  };

  try {
    const response = await axios.post(
      geminiApiEndpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: schema,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        },
      }
    );

    console.log(response.data);
    const responseText =
      response.data.candidates[0].content.parts[0].text.trim();
    const tarotResponse: TarotResponse = JSON.parse(responseText)?.[0];
    console.log(tarotResponse);

    return tarotResponse;
  } catch (error) {
    console.error("文言生成エラー:", error);
    if (error instanceof Error) {
      throw new Error(`文言生成に失敗しました: ${error.message}`);
    } else {
      throw new Error("文言生成に失敗しました。予期せぬエラーが発生しました。");
    }
  }
};
