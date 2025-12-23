"use client";

import { useState, useEffect } from "react";
import { Agent } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Github, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(agents.map((a) => a.category)))];

  const groupedAgents = filteredAgents.reduce((acc, agent) => {
    if (!acc[agent.category]) {
      acc[agent.category] = [];
    }
    acc[agent.category].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "beta":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "experimental":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Agent Directory</h1>
              <p className="text-gray-400 mt-1">
                Centralized hub for all team tools, dashboards, and agents
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search agents by name, description, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-white text-black hover:bg-white/90"
                    : "border-white/10 hover:bg-white/5"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading agents...</div>
        ) : filteredAgents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No agents found matching your criteria
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryAgents.map((agent) => (
                    <Card
                      key={agent.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-white">{agent.name}</CardTitle>
                          <Badge
                            className={getStatusColor(agent.status)}
                            variant="outline"
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-400">
                          {agent.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {agent.techStack.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="bg-white/5 text-gray-300 border-white/10"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Last updated: {new Date(agent.lastUpdated).toLocaleDateString()}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <a
                          href={agent.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full gap-2 border-white/10 hover:bg-white/5"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </Button>
                        </a>
                        {agent.demoUrl && (
                          <a
                            href={agent.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              className="w-full gap-2 border-white/10 hover:bg-white/5"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Demo
                            </Button>
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Agent Directory - Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
