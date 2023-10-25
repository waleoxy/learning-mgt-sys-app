import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage: React.FC<CourseIdPageProps> = async ({ params }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};
export default CourseIdPage;
