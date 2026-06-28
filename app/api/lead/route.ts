import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Укажите имя"),
  phone: z.string().min(10, "Укажите корректный телефон"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  cargo: z.string().optional(),
  route: z.string().optional(),
  source: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Необходимо согласие на обработку данных",
  }),
  website: z.string().optional(), // honeypot
});

export type LeadPayload = z.infer<typeof leadSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: если бот заполнил скрытое поле — молча принимаем, но не обрабатываем
    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const data = leadSchema.parse(body);

    // TODO: подключить отправку в Telegram / Email / CRM
    // Пример для Telegram:
    // const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    // const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    // if (telegramToken && telegramChatId) { ... }

    console.log("[LEAD]", {
      ...data,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Некорректные данные формы", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Не удалось обработать заявку" },
      { status: 500 }
    );
  }
}
