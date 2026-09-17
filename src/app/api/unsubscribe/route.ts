import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.redirect(new URL("/unsubscribe?status=missing", req.url));
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. Upsert suppression
    await prisma.suppression.upsert({
      where: { value: cleanEmail },
      update: { reason: "unsubscribed" },
      create: { value: cleanEmail, reason: "unsubscribed" }
    });

    // 2. Turn off email consent on matching leads
    const matchingLeads = await prisma.lead.findMany({
      where: { email: { equals: cleanEmail, mode: "insensitive" } }
    });

    for (const lead of matchingLeads) {
      await prisma.consent.updateMany({
        where: { leadId: lead.id },
        data: { emailOptIn: false }
      });

      // Pause active enrollments
      await prisma.enrollmentState.updateMany({
        where: { leadId: lead.id, status: "active" },
        data: { status: "paused" }
      });

      // Log activity
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          kind: "unsubscribed",
          summary: "Recipient clicked one-click unsubscribe link in email footer."
        }
      });
    }

    return NextResponse.redirect(new URL(`/unsubscribe?status=success&email=${encodeURIComponent(cleanEmail)}`, req.url));
  } catch (err) {
    console.error("Unsubscribe failed:", err);
    return NextResponse.redirect(new URL("/unsubscribe?status=error", req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await prisma.suppression.upsert({
      where: { value: cleanEmail },
      update: { reason: "unsubscribed" },
      create: { value: cleanEmail, reason: "unsubscribed" }
    });

    const matchingLeads = await prisma.lead.findMany({
      where: { email: { equals: cleanEmail, mode: "insensitive" } }
    });

    for (const lead of matchingLeads) {
      await prisma.consent.updateMany({
        where: { leadId: lead.id },
        data: { emailOptIn: false }
      });

      await prisma.enrollmentState.updateMany({
        where: { leadId: lead.id, status: "active" },
        data: { status: "paused" }
      });

      await prisma.activity.create({
        data: {
          leadId: lead.id,
          kind: "unsubscribed",
          summary: "Manual unsubscribe form submission."
        }
      });
    }

    return NextResponse.json({ success: true, message: "Successfully unsubscribed" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process unsubscribe" }, { status: 500 });
  }
}
