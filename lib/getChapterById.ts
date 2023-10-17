import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "./db";

const getChapterById = async (id: string, courseId: string) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id,
    },
    include: {
      muxData: true,
    },
  });

  return chapter;
};
export default getChapterById;
