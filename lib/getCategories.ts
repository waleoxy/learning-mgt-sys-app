import { db } from "./db";

const getCategories = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return categories;
};
export default getCategories;
