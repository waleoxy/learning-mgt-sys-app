import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import getAllCourses from "@/lib/getAllCourses";

interface CoursesPageProps {}

const CoursesPage: React.FC<CoursesPageProps> = async ({}) => {
  const courses = await getAllCourses();
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
