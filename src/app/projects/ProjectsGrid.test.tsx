import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/contentful";
import ProjectsGrid from "./ProjectsGrid";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  useReducedMotion: () => false,
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...props }: { children?: ReactNode }) => {
          const domProps = Object.fromEntries(
            Object.entries(props).filter(([key]) =>
              ["className", "style", "onClick"].includes(key),
            ),
          );
          return <div {...domProps}>{children}</div>;
        },
    },
  ),
}));

function makeProject(overrides: Partial<Project>): Project {
  return {
    title: "Untitled",
    slug: "untitled",
    summary: "A project.",
    projectType: "personal",
    status: "completed",
    clientAlias: null,
    skills: [],
    challenges: [],
    thumbnail: null,
    links: [],
    featured: false,
    order: 0,
    role: [],
    features: [],
    keyLearnings: [],
    architectureImage: null,
    ...overrides,
  };
}

const PROJECTS: Project[] = [
  makeProject({
    title: "Portfolio AI",
    slug: "portfolio-ai",
    projectType: "personal",
  }),
  makeProject({
    title: "Client Dashboard",
    slug: "client-dashboard",
    projectType: "professional",
  }),
  makeProject({
    title: "Another Professional Project",
    slug: "another-professional-project",
    projectType: "professional",
  }),
];

describe("ProjectsGrid", () => {
  it("renders all projects by default", () => {
    render(<ProjectsGrid projects={PROJECTS} />);

    expect(screen.getByText("Portfolio AI")).toBeInTheDocument();
    expect(screen.getByText("Client Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Another Professional Project")).toBeInTheDocument();
  });

  it("filters to only professional projects", async () => {
    const user = userEvent.setup();
    render(<ProjectsGrid projects={PROJECTS} />);

    await user.click(screen.getByRole("button", { name: /professional \(2\)/i }));

    expect(screen.queryByText("Portfolio AI")).not.toBeInTheDocument();
    expect(screen.getByText("Client Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Another Professional Project")).toBeInTheDocument();
  });

  it("filters to only personal projects", async () => {
    const user = userEvent.setup();
    render(<ProjectsGrid projects={PROJECTS} />);

    await user.click(screen.getByRole("button", { name: /personal \(1\)/i }));

    expect(screen.getByText("Portfolio AI")).toBeInTheDocument();
    expect(screen.queryByText("Client Dashboard")).not.toBeInTheDocument();
  });

  it("shows an empty state when a filter matches nothing", async () => {
    const user = userEvent.setup();
    render(<ProjectsGrid projects={[]} />);

    await user.click(screen.getByRole("button", { name: /^all$/i }));

    expect(screen.getByText(/no all projects yet/i)).toBeInTheDocument();
  });
});
