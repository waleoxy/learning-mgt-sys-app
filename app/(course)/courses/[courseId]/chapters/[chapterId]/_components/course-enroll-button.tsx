"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({
  price,
  courseId,
}) => {
  return (
    <Button size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
};
export default CourseEnrollButton;
