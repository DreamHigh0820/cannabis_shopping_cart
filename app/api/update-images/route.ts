import { NextResponse } from "next/server"
import { updateAllImages } from "@/scripts/update-images"

export async function POST() {
  try {
    await updateAllImages()
    return NextResponse.json({ success: true, message: "Images updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
