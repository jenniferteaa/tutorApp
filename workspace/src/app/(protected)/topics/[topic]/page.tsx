import TopicPanel from "@/components/TopicPanel";
import { getTopicDetails } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const session = await getAuthSession();
  const { topic } = await params;
  const data = await getTopicDetails(topic, session);
  return <TopicPanel data={data} />;
}
