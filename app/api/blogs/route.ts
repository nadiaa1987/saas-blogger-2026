import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { blogName, blogUrl, secretEmail, niche, smtpEmail, smtpPassword } = await req.json();

    if (!blogName || !blogUrl || !secretEmail || !smtpEmail || !smtpPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SMTP settings already exist for this email
    let smtpSettings = await prisma.sMTPSettings.findFirst({
      where: { email: smtpEmail },
    });

    if (!smtpSettings) {
      smtpSettings = await prisma.sMTPSettings.create({
        data: {
          email: smtpEmail,
          appPassword: smtpPassword,
        },
      });
    } else if (smtpSettings.appPassword !== smtpPassword) {
      // Update password if it changed
      smtpSettings = await prisma.sMTPSettings.update({
        where: { id: smtpSettings.id },
        data: { appPassword: smtpPassword },
      });
    }

    // Create the blog connection
    const blog = await prisma.blog.create({
      data: {
        name: blogName,
        url: blogUrl,
        secretEmail: secretEmail,
        niche: niche,
        smtpSettingsId: smtpSettings.id,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to connect blog: " + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        smtpSettings: true,
      },
    });
    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
