import { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { supabase } from "@/lib/supabase";

interface Session {
  id: string;
  subject: string;
  duration: number;
  completed: boolean;
  created_at: string;
}

export function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);

  async function fetchSessions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSessions(data || []);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <MainLayout>
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">
          Session History
        </h1>

        <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#1f2937] text-left">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-gray-800"
                >
                  <td className="p-4">
                    {session.subject}
                  </td>

                  <td className="p-4">
                    {session.duration} mins
                  </td>

                  <td className="p-4">
                    {new Date(
                      session.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}

              {sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-gray-400"
                  >
                    No study sessions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}