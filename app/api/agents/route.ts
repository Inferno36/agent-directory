import { NextRequest, NextResponse } from "next/server";
import { Agent } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";
import {
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  createTableIfNotExists,
} from "@/lib/db";

// GET all agents
export async function GET() {
  try {
    await createTableIfNotExists();
    const agents = await getAllAgents();
    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

// POST new agent
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newAgent: Agent = await request.json();
    
    // Generate ID if not provided
    if (!newAgent.id) {
      newAgent.id = `agent-${Date.now()}`;
    }

    await createTableIfNotExists();
    const agent = await createAgent(newAgent);

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}

// PUT update agent
export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedAgent: Agent = await request.json();
    await createTableIfNotExists();
    const agent = await updateAgent(updatedAgent);

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

// DELETE agent
export async function DELETE(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    await createTableIfNotExists();
    await deleteAgent(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
