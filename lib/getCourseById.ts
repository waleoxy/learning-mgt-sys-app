import { db } from "./db";

const getCourseById = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });
  return course;
};

export default getCourseById;
