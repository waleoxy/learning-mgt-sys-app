import getCategories from "@/lib/getCategories";
import Categories from "./_components/categpries";
import SearchInput from "@/components/searchInput";
import { getcourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    categoryId: string;
    title: string;
  };
}

const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const categories = await getCategories();

  const courses = await getcourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
