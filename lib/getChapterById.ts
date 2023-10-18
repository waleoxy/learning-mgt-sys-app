import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "./db";

const getChapterById = async (courseId: string, chapterId: string) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
    },
    include: {
      muxData: true,
    },
  });

  return chapter;
};
export default getChapterById;
