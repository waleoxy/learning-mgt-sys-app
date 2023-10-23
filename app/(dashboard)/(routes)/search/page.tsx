import getCategories from "@/lib/getCategories";

interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = async ({}) => {
  const categories = await getCategories();

  return (
    <div className="p-6">
      <categories items={categories} />
    </div>
  );
};

export default SearchPage;
