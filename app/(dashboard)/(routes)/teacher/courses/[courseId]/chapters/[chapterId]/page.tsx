import getChapterById from "@/lib/getChapterById";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ChapterDetail = async ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const chapter = await getChapterById(params.chapterId, params.courseId);

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields{completionText}
              </span>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default ChapterDetail;
