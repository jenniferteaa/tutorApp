import TopicModalGrid from "@/components/TopicModalGrid";
import { getUserSummary, getUserTopics } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/login");
  }
  const { username, user_id } = await getUserSummary(session);
  const topics = await getUserTopics(session);
  const backendBase =
    process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000";

  console.log("this is the uuid: ", user_id);
  return (
    <main className="min-h-screen bg-[rgb(200,208,204)] p-10">
      {/* <div className="mx-auto w-full max-w-4xl rounded-3xl bg-black/10 p-10"> */}
      {/* <div className="mb-10 rounded-2xl border border-black/20 mt-15 bg-white px-8 py-6 shadow-sm"> */}
      <h1 className="text-2xl">Hello {username}!</h1>
      {/* </div> */}
      <div className="mx-auto max-w-4xl mt-15">
        {topics.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-black/10 bg-white/70 px-6 py-8 text-center text-sm text-black/60 shadow-sm">
            Hey! nothing here yet. Use the extension to start tracking!
          </div>
        ) : (
          <TopicModalGrid topics={topics} backendBase={backendBase} />
        )}
      </div>
      {/* </div> */}
    </main>
  );
}
