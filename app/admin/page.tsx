"use client";

import { useState, useEffect } from "react";
import { Agent } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Home, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    githubUrl: "",
    category: "",
    status: "stable" as "beta" | "stable" | "experimental",
    techStack: "",
    demoUrl: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/agents");
      if (response.ok) {
        setIsAuthenticated(true);
        fetchAgents();
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword("");
        fetchAgents();
      } else {
        setError("Invalid password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setAgents([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents");
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const agent: Agent = {
        id: editingAgent?.id || `agent-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        githubUrl: formData.githubUrl,
        category: formData.category,
        status: formData.status,
        techStack: formData.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        lastUpdated: new Date().toISOString().split("T")[0],
        demoUrl: formData.demoUrl || undefined,
      };

      const method = editingAgent ? "PUT" : "POST";
      const response = await fetch("/api/agents", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent),
      });

      if (response.ok) {
        fetchAgents();
        resetForm();
      } else {
        setError("Failed to save agent");
      }
    } catch (error) {
      setError("An error occurred while saving");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description,
      githubUrl: agent.githubUrl,
      category: agent.category,
      status: agent.status,
      techStack: agent.techStack.join(", "),
      demoUrl: agent.demoUrl || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const response = await fetch(`/api/agents?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAgents();
      } else {
        setError("Failed to delete agent");
      }
    } catch (error) {
      setError("An error occurred while deleting");
      console.error("Delete error:", error);
    }
  };

  const resetForm = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      description: "",
      githubUrl: "",
      category: "",
      status: "stable",
      techStack: "",
      demoUrl: "",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-gray-400">
              Enter password to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 mt-1">Manage agents and tools</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">
                {editingAgent ? "Edit Agent" : "Add New Agent"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {editingAgent
                  ? "Update the agent details below"
                  : "Fill in the details to add a new agent"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="githubUrl" className="text-white">
                    GitHub URL *
                  </Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="demoUrl" className="text-white">
                    Demo URL (optional)
                  </Label>
                  <Input
                    id="demoUrl"
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, demoUrl: e.target.value })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">
                    Category *
                  </Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Data Processing">Data Processing</option>
                    <option value="Automation">Automation</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Communication">Communication</option>
                    <option value="Security">Security</option>
                    <option value="Development Tools">Development Tools</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-white">
                    Status *
                  </Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "beta" | "stable" | "experimental",
                      })
                    }
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  >
                    <option value="stable">Stable</option>
                    <option value="beta">Beta</option>
                    <option value="experimental">Experimental</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="techStack" className="text-white">
                    Tech Stack (comma-separated) *
                  </Label>
                  <Input
                    id="techStack"
                    value={formData.techStack}
                    onChange={(e) =>
                      setFormData({ ...formData, techStack: e.target.value })
                    }
                    placeholder="e.g. Python, FastAPI, PostgreSQL"
                    className="mt-1 bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-white text-black hover:bg-white/90"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingAgent
                      ? "Update Agent"
                      : "Add Agent"}
                  </Button>
                  {editingAgent && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-white/10 hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Existing Agents</CardTitle>
                <CardDescription className="text-gray-400">
                  {agents.length} agent{agents.length !== 1 ? "s" : ""} in the directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{agent.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {agent.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-2 bg-white/5 text-gray-300 border-white/10"
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(agent)}
                          className="gap-1 border-white/10 hover:bg-white/5"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(agent.id)}
                          className="gap-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {agents.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                      No agents yet. Add your first agent!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
