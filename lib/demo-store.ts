import { promises as fs } from "node:fs";
import path from "node:path";

export type IdeaStatus = "pending" | "approved" | "archived";

export type IdeaRecord = {
  id: string;
  title: string;
  category: string;
  source: string;
  urgency: number;
  status: IdeaStatus;
  summary: string;
};

export type DemoStore = {
  ideas: IdeaRecord[];
  keywords: string[];
};

const defaultIdeas: IdeaRecord[] = [
  {
    id: "idea-1",
    title: "AI support agents for SMB SaaS",
    category: "support ops",
    source: "Reddit /r/startups",
    urgency: 9.6,
    status: "pending",
    summary:
      "Users report their help desk is overrun by repetitive tickets, and founders are actively asking for AI-first triage workflows.",
  },
  {
    id: "idea-2",
    title: "Vendor invoice cleanup automation",
    category: "finance ops",
    source: "X / finance founders",
    urgency: 8.8,
    status: "approved",
    summary:
      "Founders describe the current manual reconciliation flow as draining overhead and slowing close cycles.",
  },
  {
    id: "idea-3",
    title: "Managed onboarding for B2B products",
    category: "onboarding",
    source: "Reddit /r/saas",
    urgency: 8.3,
    status: "pending",
    summary:
      "Teams repeatedly mention activation drops during week-two customer onboarding after straightforward pilot sales.",
  },
  {
    id: "idea-4",
    title: "Billing transparency tooling",
    category: "billing",
    source: "Product Hunt threads",
    urgency: 7.9,
    status: "archived",
    summary:
      "Customers ask for clearer pricing explanations and breakdowns that reduce confusion during expansion.",
  },
];

const defaultKeywords = [
  "AI onboarding",
  "billing breakdown",
  "customer support debt",
  "VAT automation",
];

const DATA_PATH = path.join(process.cwd(), "data", "painpoint-demo.json");

async function ensureStore(): Promise<void> {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });

  try {
    await fs.access(DATA_PATH);
  } catch {
    const initial: DemoStore = {
      ideas: defaultIdeas,
      keywords: defaultKeywords,
    };
    await fs.writeFile(DATA_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readStore(): Promise<DemoStore> {
  await ensureStore();
  const raw = await fs.readFile(DATA_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw) as DemoStore;
    return {
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : defaultIdeas,
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : defaultKeywords,
    };
  } catch {
    return {
      ideas: defaultIdeas,
      keywords: defaultKeywords,
    };
  }
}

export async function writeStore(next: DemoStore): Promise<void> {
  await ensureStore();
  await fs.writeFile(DATA_PATH, JSON.stringify(next, null, 2), "utf8");
}

export async function updateIdeaStatus(id: string, status: IdeaStatus): Promise<IdeaRecord | null> {
  const store = await readStore();
  const updated = store.ideas.map((idea) =>
    idea.id === id ? { ...idea, status } : idea,
  );

  const target = updated.find((idea) => idea.id === id) ?? null;
  await writeStore({ ...store, ideas: updated });
  return target;
}

export async function addKeyword(keyword: string): Promise<string[]> {
  const normalized = keyword.trim();
  if (!normalized) {
    return [];
  }

  const store = await readStore();
  const nextKeywords = store.keywords.includes(normalized)
    ? store.keywords
    : [...store.keywords, normalized];

  await writeStore({ ...store, keywords: nextKeywords });
  return nextKeywords;
}

export async function removeKeyword(keyword: string): Promise<string[]> {
  const store = await readStore();
  const nextKeywords = store.keywords.filter((item) => item !== keyword);
  await writeStore({ ...store, keywords: nextKeywords });
  return nextKeywords;
}

export async function ingestIdeas(
  items: Array<{
    title?: string;
    url?: string;
    selftext?: string;
    score?: number;
    source?: string;
    category?: string;
  }>,
): Promise<IdeaRecord[]> {
  const store = await readStore();
  const incoming: IdeaRecord[] = [];

  items.forEach((item, index) => {
    const title = (item.title || item.selftext || "New signal").trim();
    if (!title) {
      return;
    }

    incoming.push({
      id: `idea-${Date.now()}-${index}`,
      title: title.slice(0, 120),
      category: item.category || "general",
      source: item.source || "public signal",
      urgency: Number(item.score) ? Math.min(10, Math.max(4, Number(item.score) / 10)) : 7.4,
      status: "pending",
      summary:
        (item.selftext || item.title || "Fresh market signal detected from public conversations.")
          .slice(0, 220),
    });
  });

  const merged = [...incoming, ...store.ideas].slice(0, 20);
  await writeStore({ ...store, ideas: merged });
  return merged;
}
