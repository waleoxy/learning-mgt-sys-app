import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseNavbarProps } from "./course-navbar";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";

const CourseMobileSidebar: React.FC<CourseNavbarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
