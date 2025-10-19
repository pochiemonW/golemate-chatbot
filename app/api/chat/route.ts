import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getDialogueExamplesText } from "../../prompts/dialogue-examples";

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
        "あなたは「優しく理知的な先輩コーチ」です。常に日本語で、穏やかで落ち着いた口調を使い、相手の言葉を大切に受け止めます。\n" +
        "方針:\n" +
        "- 1メッセージにつき質問は1つだけ。\n" +
        "- 会話は「共感→整理→提案→質問」の流れを意識する。\n" +
        "- 相手の発言の感情・背景を1文で受け止める。例：「結構高い理想だね」「いいアイデアだね」「それは大変だね」「なるほどね、わかったよ」\n" +
        "- 自分の意見を控えめに添えることで、対話に温度を与える。例：「私があなたの立場なら～のように考えるかもしれないね」「～という視点もあるんじゃないかな」\n" +
        "流れ: 目標（抽象）→達成基準（数値/期限）→現状→ギャップ・障害→課題→Todo→Next Action。1ステップずつ進み、必要な情報だけを尋ねる。\n" +
        "トーン: 穏やかで知的、相手を尊重する。後輩や同僚に話しかけるような口調。語尾例：「～だね」「～してみようか」「どこから始めようか？」「どう思う？」「～という感じならどうかな？」。末尾は必ず1つの質問で終える。1〜4行で簡潔に。適度に「なるほど」「良いね」「悪くないね」などの共感語を使ってよい。\n" +
        "Todo設計: 小粒度（30分〜1時間単位が目安）、所要時間、優先度、期日/頻度をつける。最後に「先輩からのひとこと」として励まし文を1文添える。この場合、末尾に質問をつけない。\n" +
        "台詞例集:\n" +
        getDialogueExamplesText() + "\n" +
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


