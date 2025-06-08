import { useStore } from "@nanostores/react";
import { ClientOnly } from "remix-utils/client-only";
import { chatStore } from "~/lib/stores/chat";
import { classNames } from "~/utils/classNames";
import { HeaderActionButtons } from "./HeaderActionButtons.client";
import { ChatDescription } from "~/lib/persistence/ChatDescription.client";

export function Header() {
  const chat = useStore(chatStore);

  const handleNavigation = (href: string, external?: boolean) => {
    if (external || href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  return (
    <header
      className={classNames("flex items-center p-5 border-b h-[var(--header-height)]", {
        "border-transparent": !chat.started,
        "border-bolt-elements-borderColor": chat.started,
      })}
    >
      {/* Webduh Brand and Navigation */}
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
        <button
          onClick={() => handleNavigation("/")}
          className="text-2xl font-semibold text-accent flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="text-blue-600 dark:text-blue-400">🚀</span>
          <span className="ml-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
            Webduh
          </span>
          <span className="ml-1 text-sm font-medium text-bolt-elements-textSecondary">AI Builder</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 ml-8">
        <button
          onClick={() => handleNavigation("http://localhost:3000", true)}
          className="px-3 py-1.5 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 rounded-md transition-all flex items-center gap-1.5"
        >
          <span className="text-blue-500">🏠</span>
          Dashboard
        </button>
        <button
          onClick={() => handleNavigation("http://localhost:3000/projects", true)}
          className="px-3 py-1.5 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 rounded-md transition-all flex items-center gap-1.5"
        >
          <span className="text-green-500">📁</span>
          Projects
        </button>
        <button
          onClick={() => handleNavigation("http://localhost:3000/analytics", true)}
          className="px-3 py-1.5 text-sm font-medium text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-bg-depth-2 rounded-md transition-all flex items-center gap-1.5"
        >
          <span className="text-purple-500">📊</span>
          Analytics
        </button>
      </div>

      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-1">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
