import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_TOKEN_IS!,
  process.env.MUX_TPKEN_SECRET!
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        userId,
        id: params.courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const publish = searchParams.get("publish");
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (publish === null) {
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
    }

    if (publish === "false") {
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId,
        },
        include: {
          chapters: {
            include: {
              muxData: true,
            },
          },
        },
      });

      if (!course) {
        return new NextResponse("Not found", { status: 404 });
      }

      const hasPublishedChapter = course.chapters.some(
        (chapter) => chapter.isPublished
      );

      if (
        !course.title ||
        !course.categoryId ||
        !course.description ||
        !course.imageUrl ||
        !hasPublishedChapter
      ) {
        return new NextResponse("Missing required fields", { status: 401 });
      }

      const publishedCourse = await db.course.update({
        where: {
          id: params.courseId,
          userId,
        },
        data: {
          isPublished: true,
        },
      });

      return NextResponse.json(publishedCourse);
    } else {
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId,
        },
      });

      if (!course) {
        return new NextResponse("Not found", { status: 404 });
      }

      const unPublishedCourse = await db.course.update({
        where: {
          id: params.courseId,
          userId,
        },
        data: {
          isPublished: false,
        },
      });

      return NextResponse.json(unPublishedCourse);
    }
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
