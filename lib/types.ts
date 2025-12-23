export interface Agent {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  category: string;
  status: "beta" | "stable" | "experimental";
  techStack: string[];
  lastUpdated: string;
  demoUrl?: string;
}

export type AgentCategory = 
  | "Data Processing"
  | "Automation"
  | "Monitoring"
  | "Analytics"
  | "Communication"
  | "Security"
  | "Development Tools"
  | "Other";
