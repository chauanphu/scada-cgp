import { NextRequest, NextResponse } from "next/server";
import { EnergyData } from "@/types/Report";
import { getEnergyData, View } from "@/lib/api";

// Get enery data
export async function GET(request: NextRequest) {
  try {
    // Retrieve the token from HTTP-only cookies
    const token = request.cookies.get("token")?.value;
    const view = request.nextUrl.searchParams.get("view") as View;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("View: ", view);
    const data: EnergyData[] = await getEnergyData(token, view);
    return NextResponse.json(data);
  } catch (error: any) {
    // If 401, return unauthorized
    if (error.message === "Failed to fetch data") {
      // Redirect to login page
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
