import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { UserRole, VersionType } from "@/lib/enums";
import { addAuditEvent } from "@/lib/audit";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storeUpload } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const requestId = formData.get("requestId");
    const fileValue = formData.get("file");

    if (typeof requestId !== "string" || !requestId) {
      return NextResponse.json(
        { error: "requestId is required." },
        { status: 400 }
      );
    }
    if (!(fileValue instanceof File) || fileValue.size === 0) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const translationRequest = await prisma.translationRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        organizationId: true,
        sourceLanguage: true,
      },
    });

    if (!translationRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (
      session.user.role === UserRole.CLIENT &&
      translationRequest.organizationId !== session.user.organizationId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stored = await storeUpload(fileValue);

    await prisma.documentAsset.create({
      data: {
        requestId,
        fileName: stored.fileName,
        filePath: stored.filePath,
        fileType: stored.fileType,
        fileSize: stored.fileSize,
        extractedText: stored.extractedText,
      },
    });

    if (stored.extractedText) {
      await prisma.translationVersion.create({
        data: {
          requestId,
          type: VersionType.SOURCE_EXTRACT,
          content: stored.extractedText,
          language: translationRequest.sourceLanguage,
          createdBy: session.user.name ?? "Uploader",
          notes: "Extracted from uploaded TXT document.",
        },
      });
    }

    await addAuditEvent({
      requestId,
      userId: session.user.id,
      actor: session.user.name ?? "Uploader",
      action: "Client uploaded document",
      metadata: {
        fileName: stored.fileName,
        fileType: stored.fileType,
        fileSize: stored.fileSize,
      },
    });

    return NextResponse.json({ ok: true, file: stored });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    );
  }
}
