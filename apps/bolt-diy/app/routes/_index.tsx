import { json, type MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";
import { BaseChat } from "~/components/chat/BaseChat";
import { Chat } from "~/components/chat/Chat.client";
import { Header } from "~/components/header/Header";
import BackgroundRays from "~/components/ui/BackgroundRays";

export const meta: MetaFunction = () => {
  return [
    { title: "Webduh AI Builder - The Ultimate v0.dev Competitor" },
    {
      name: "description",
      content:
        "Build amazing projects with Webduh AI Builder - powered by multiple LLMs including GPT-4, Claude, and more. The ultimate v0.dev alternative.",
    },
  ];
};

export const loader = () => json({});

/**
 * Landing page component for Webduh AI Builder
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
