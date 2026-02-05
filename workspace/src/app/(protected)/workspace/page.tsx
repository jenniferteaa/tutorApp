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

  console.log("this is the uuid: ", user_id);
  return (
    <main className="min-h-screen bg-[rgb(200,208,204)] p-10">
      {/* <div className="mx-auto w-full max-w-4xl rounded-3xl bg-black/10 p-10"> */}
      {/* <div className="mb-10 rounded-2xl border border-black/20 mt-15 bg-white px-8 py-6 shadow-sm"> */}
      <h1 className="text-2xl">Hello {username}!</h1>
      {/* </div> */}
      <div className="mx-auto max-w-4xl mt-15">
        <TopicModalGrid topics={topics} />
      </div>
      {/* </div> */}
    </main>
  );
}

// #F9FAFB

// #F3F4F6

// #E5E7EB

// #D1D5DB

// #9CA3AF

// #6B7280

// #4B5563

// #374151 – primary text (soft black)

// #1F2937 – very dark gray

// #111827 – near black
