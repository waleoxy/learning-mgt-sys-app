import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";

const getCourseById = async (id: string) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return course;
};

export default getCourseById;
