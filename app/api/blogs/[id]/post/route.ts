import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailToBlogger } from "@/lib/mailer";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get blog and its SMTP settings
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { smtpSettings: true },
    });

    if (!blog || !blog.smtpSettings) {
      return NextResponse.json(
        { error: "Blog or SMTP settings not found" },
        { status: 404 }
      );
    }

    // Send email to Blogger's secret email
    const result = await sendEmailToBlogger({
      smtpEmail: blog.smtpSettings.email,
      smtpPassword: blog.smtpSettings.appPassword,
      to: blog.secretEmail,
      subject: title,
      body: content,
    });

    if (result.success) {
      return NextResponse.json({ message: "Post sent to Blogger via Email" });
    } else {
      return NextResponse.json(
        { error: "Failed to send post: " + result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error posting to blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
