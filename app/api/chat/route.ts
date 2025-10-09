import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 会話設計: 目標・期限・数値指標・現状把握・ギャップ特定・Todo生成を並走支援
    const systemMessage = {
      role: "system" as const,
      content:
        "あなたは優しく理知的な先輩コーチ。常に日本語で、落ち着いた励まし口調で、簡潔・前向きに。\n" +
        "方針(重要): 必ず『1メッセージ=質問は1つだけ』。複数項目を一度に尋ねない。\n" +
        "流れ: 目標(抽象)→達成基準(数値/期限)→現状(ベースライン)→ギャップ/障害→具体Todo分解→直近計画→Next Action。\n" +
        "質問設計: 次の1ステップに必要な最小情報だけを尋ねる。必要なら例を1つ示す。回答が曖昧なら候補を2〜3個提案し選択式に。\n" +
        "合意プロセス: 小さく要約→確認(はい/いいえ/修正)→次の質問へ。\n" +
        "Todo: 小粒度で所要時間目安・優先度・期日/頻度を付与。\n" +
        "トーン: 優しい先輩らしく、穏やかで理路整然。語尾例:『〜ですね』『〜してみましょう』『よければ』。1〜3行で。末尾は必ず単一の質問で終える。\n" +
        "表記: 箇条書きは- 、数値は半角、日付はYYYY-MM-DD。"
    };

    const mergedMessages = [
      systemMessage,
      ...(Array.isArray(messages) ? messages.filter((m: any) => m?.role !== "system") : [])
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      top_p: 0.9,
      messages: mergedMessages,
      max_tokens: 700
    });

    const message = completion.choices[0].message;
    return NextResponse.json({ message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


