import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { MuxData } from "@prisma/client";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });
    return NextResponse.json(chapter);
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
    const chapterId = searchParams.get("chapterId");
    const publish = searchParams.get("publish");

    if (chapterId === null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const couserOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!couserOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(chapterId, publish);

    if (publish === null) {
      const { isPublished, ...values } = await request.json();
      const chapter = await db.chapter.update({
        where: {
          id: chapterId,
          courseId: params.courseId,
        },
        data: { ...values },
      });

      if (values.videoUrl) {
        console.log(values.videoUrl);

        const existingMuxdata = await db.muxData.findFirst({
          where: {
            chapterId: chapterId,
          },
        });

        if (existingMuxdata !== null) {
          await Video.Assets.del(existingMuxdata.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxdata.id,
            },
          });
        }

        const asset = await Video.Assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });

        await db.muxData.create({
          data: {
            chapterId: chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id!,
          },
        });
      }

      return NextResponse.json(chapter);
    } else {
      if (publish === "true") {
        const unPublishedChapter = await db.chapter.update({
          where: {
            id: chapterId,
            courseId: params.courseId,
          },
          data: {
            isPublished: false,
          },
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
          where: {
            courseId: params.courseId,
            isPublished: true,
          },
        });

        if (!publishedChaptersInCourse.length) {
          await db.course.update({
            where: {
              id: params.courseId,
            },
            data: {
              isPublished: false,
            },
          });
        }

        return NextResponse.json(unPublishedChapter);
      } else {
        const chapter = await db.chapter.findUnique({
          where: {
            id: chapterId,
            courseId: params.courseId,
          },
        });

        const muxData = await db.muxData.findUnique({
          where: {
            chapterId: chapterId,
          },
        });

        if (
          !chapter ||
          !muxData ||
          !chapter.title ||
          !chapter.description ||
          !chapter.videoUrl
        ) {
          return new NextResponse("Missing rquired fields", { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
          where: {
            id: chapterId,
            courseId: params.courseId,
          },
          data: {
            isPublished: true,
          },
        });
        return NextResponse.json(publishedChapter);
      }
    }
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get("chapterId");

    if (!chapterId) {
      return new NextResponse("Internal error", { status: 500 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    return new NextResponse("Somethimg went wrong");
  }
}
