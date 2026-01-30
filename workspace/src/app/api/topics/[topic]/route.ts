import { NextResponse } from "next/server";

import { getTopicDetails } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ topic: string }> },
) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { topic } = await params;
  const data = await getTopicDetails(topic, session);
  return NextResponse.json(data);
}
