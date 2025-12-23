import { sql } from "@vercel/postgres";
import { Agent } from "./types";

export async function createTableIfNotExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        github_url TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT NOT NULL,
        tech_stack TEXT[] NOT NULL,
        last_updated DATE NOT NULL,
        demo_url TEXT
      );
    `;
    console.log("Table created or already exists");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
}

export async function getAllAgents(): Promise<Agent[]> {
  try {
    const { rows } = await sql`SELECT * FROM agents ORDER BY last_updated DESC`;
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      githubUrl: row.github_url,
      category: row.category,
      status: row.status as "beta" | "stable" | "experimental",
      techStack: row.tech_stack,
      lastUpdated: row.last_updated,
      demoUrl: row.demo_url || undefined,
    }));
  } catch (error) {
    console.error("Error getting agents:", error);
    throw error;
  }
}

export async function createAgent(agent: Agent): Promise<Agent> {
  try {
    await sql`
      INSERT INTO agents (id, name, description, github_url, category, status, tech_stack, last_updated, demo_url)
      VALUES (${agent.id}, ${agent.name}, ${agent.description}, ${agent.githubUrl}, ${agent.category}, ${agent.status}, ${agent.techStack}, ${agent.lastUpdated}, ${agent.demoUrl || null})
    `;
    return agent;
  } catch (error) {
    console.error("Error creating agent:", error);
    throw error;
  }
}

export async function updateAgent(agent: Agent): Promise<Agent> {
  try {
    await sql`
      UPDATE agents
      SET name = ${agent.name},
          description = ${agent.description},
          github_url = ${agent.githubUrl},
          category = ${agent.category},
          status = ${agent.status},
          tech_stack = ${agent.techStack},
          last_updated = ${agent.lastUpdated},
          demo_url = ${agent.demoUrl || null}
      WHERE id = ${agent.id}
    `;
    return agent;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
}

export async function deleteAgent(id: string): Promise<void> {
  try {
    await sql`DELETE FROM agents WHERE id = ${id}`;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
}
