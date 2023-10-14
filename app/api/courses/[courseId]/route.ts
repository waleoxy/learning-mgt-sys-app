import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const values = await request.json();

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
