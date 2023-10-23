import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";

const getAllCourses = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return courses;
};

export default getAllCourses;
