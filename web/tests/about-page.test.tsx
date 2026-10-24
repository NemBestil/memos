import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import About from "@/pages/About";

const mockInstance = {
  profile: {
    version: "0.25.0",
    commit: "0123456789abcdef0123456789abcdef01234567",
    instanceUrl: "",
    demo: false,
    admin: undefined as { username: string; displayName: string } | undefined,
  },
  generalSetting: {} as { customProfile?: { title: string; description: string; logoUrl: string } },
};

vi.mock("@/contexts/InstanceContext", () => ({
  useInstance: () => mockInstance,
}));

vi.mock("@/utils/i18n", () => ({
  useTranslate: () => (key: string) =>
    (
      ({
        "common.version": "Version",
        "about.powered-by": "Powered by Memos",
      }) as Record<string, string>
    )[key] ?? key,
}));

const renderAbout = () => render(<About />);

describe("<About>", () => {
  beforeEach(() => {
    mockInstance.profile = {
      version: "0.25.0",
      commit: "0123456789abcdef0123456789abcdef01234567",
      instanceUrl: "https://notes.example.com",
      demo: false,
      admin: { username: "steven", displayName: "Steven" },
    };
    mockInstance.generalSetting = {};
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the identity hero without build details", () => {
    renderAbout();

    expect(screen.getByRole("heading", { name: "Memos" })).toBeInTheDocument();
    expect(document.querySelector(".memos-mark")).toHaveAttribute("fill", "currentColor");
    expect(document.querySelector(".memos-mark")).toHaveAttribute("height", "48");
    expect(screen.getByText("Simple note-taking for your everyday thoughts.")).toBeInTheDocument();
    expect(screen.queryByText("about.description")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Version/ })).not.toBeInTheDocument();
    expect(screen.queryByText("v0.25.0")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "0123456" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "about.build" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "MIT" })).not.toBeInTheDocument();
  });

  it("does not render the project links section", () => {
    renderAbout();

    expect(screen.queryByRole("navigation", { name: "about.project-links" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "about.project" })).not.toBeInTheDocument();
  });

  it("does not surface the instance URL, administrator, or birds", () => {
    renderAbout();

    expect(screen.queryByText("https://notes.example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("Administrator")).not.toBeInTheDocument();
    expect(screen.queryByText("Steven")).not.toBeInTheDocument();
    expect(screen.queryByText("Birds")).not.toBeInTheDocument();
    expect(screen.queryByTestId("about-bird-sprite")).not.toBeInTheDocument();
  });

  it("shows the demo badge on demo instances", () => {
    mockInstance.profile.demo = true;

    renderAbout();

    expect(screen.getByText("about.demo")).toBeInTheDocument();
  });

  it("uses custom branding for the identity hero and credits Memos", () => {
    mockInstance.generalSetting = {
      customProfile: {
        title: "Team Notes",
        description: "Nye features og bugfixes.\n\nKontakt os for mere information.",
        logoUrl: "/custom-logo.png",
      },
    };

    renderAbout();

    expect(screen.getByRole("heading", { name: "Team Notes" })).toBeInTheDocument();
    const description = screen.getByText(/Nye features og bugfixes/);
    expect(description.textContent).toBe("Nye features og bugfixes.\n\nKontakt os for mere information.");
    expect(description).toHaveClass("whitespace-pre-line");
    expect(screen.queryByText("Simple note-taking for your everyday thoughts.")).not.toBeInTheDocument();
    expect(document.querySelector("img")).toHaveAttribute("src", "/custom-logo.png");
    expect(screen.getByRole("link", { name: "Powered by Memos" })).toHaveAttribute("href", "https://usememos.com/");
    expect(screen.queryByRole("heading", { name: "about.build" })).not.toBeInTheDocument();
    expect(screen.queryByText("about.distribution")).not.toBeInTheDocument();
  });

  it("renders as a page without nested mobile padding", () => {
    const { container } = renderAbout();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const contentWrapper = container.querySelector("section > div");
    expect(contentWrapper).toHaveClass("w-full");
    expect(contentWrapper).not.toHaveClass("px-4");
  });
});
