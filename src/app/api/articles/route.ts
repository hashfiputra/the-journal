import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

import { toNumber } from "@lib/utils";
import { type GetArticlesPayload, getArticles, createArticle } from "@lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payload: GetArticlesPayload = {
    articleId: searchParams.get("articleId") || undefined,
    userId: searchParams.get("userId") || undefined,
    title: searchParams.get("title") || undefined,
    category: searchParams.get("category") || undefined,
    createdAtStart: searchParams.get("createdAtStart") || undefined,
    updatedAtEnd: searchParams.get("updatedAtEnd") || undefined,
    sortOrder: searchParams.get("sortOrder") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    limit: toNumber(searchParams.get("limit")) || 9,
    page: toNumber(searchParams.get("page")) || 1,
  };

  try {
    const data = await getArticles(payload);
    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (e) {
    const response = isAxiosError(e) ? e.response : null;
    const message = response?.data?.error || "Something went wrong, try again later";
    const status = response?.status || 400;
    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await createArticle(payload);

    const message = "Article created successfully";
    return NextResponse.json({ success: true, message }, { status: 200 });
  } catch (e) {
    const response = isAxiosError(e) ? e.response : null;
    const message = response?.data?.error || "Something went wrong, try again later";
    const status = response?.status || 400;
    return NextResponse.json({ success: false, message }, { status });
  }
}