"use client";

import { Category } from "@prisma/client";
import {
  FcBiohazard,
  FcBiomass,
  FcBiotech,
  FcCalculator,
  FcEngineering,
  FcMultipleDevices,
  FcMusic,
  FcSalesPerformance,
} from "react-icons/fc";
import { IconType } from "react-icons";
import CategoryItem from "./category-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Biology: FcBiomass,
  Physics: FcEngineering,
  "Computer Science": FcMultipleDevices,
  Mathematics: FcCalculator,
  Economics: FcSalesPerformance,
  Chemistry: FcBiohazard,
};

const Categories: React.FC<CategoriesProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
