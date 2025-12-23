import { sql } from "@vercel/postgres";

async function seed() {
  try {
    // Create table
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
    console.log("✓ Table created");

    // Insert sample data
    const sampleAgents = [
      {
        id: "sample-agent-1",
        name: "Sample Data Processor",
        description: "An example agent that processes and transforms data from multiple sources",
        githubUrl: "https://github.com/yourusername/sample-data-processor",
        category: "Data Processing",
        status: "stable",
        techStack: ["Python", "Pandas", "FastAPI"],
        lastUpdated: "2024-12-20",
      },
      {
        id: "sample-agent-2",
        name: "Task Automator",
        description: "Automates repetitive tasks and workflows across multiple platforms",
        githubUrl: "https://github.com/yourusername/task-automator",
        category: "Automation",
        status: "beta",
        techStack: ["Node.js", "TypeScript", "Puppeteer"],
        lastUpdated: "2024-12-22",
      },
      {
        id: "sample-agent-3",
        name: "System Monitor",
        description: "Real-time monitoring dashboard for system health and performance metrics",
        githubUrl: "https://github.com/yourusername/system-monitor",
        category: "Monitoring",
        status: "stable",
        techStack: ["Go", "Prometheus", "Grafana"],
        lastUpdated: "2024-12-15",
        demoUrl: "https://monitor-demo.example.com",
      },
    ];

    for (const agent of sampleAgents) {
      await sql`
        INSERT INTO agents (id, name, description, github_url, category, status, tech_stack, last_updated, demo_url)
        VALUES (${agent.id}, ${agent.name}, ${agent.description}, ${agent.githubUrl}, ${agent.category}, ${agent.status}, ${agent.techStack}, ${agent.lastUpdated}, ${agent.demoUrl || null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
    console.log("✓ Sample data inserted");

    console.log("\n✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed();
