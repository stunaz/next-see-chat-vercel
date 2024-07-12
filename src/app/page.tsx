import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex-1 overflow-y-hidden">
      <div className="flex h-full flex-col">
        <header className="p-4">
          <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
            tRPC SSE starter
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showcases Server-sent Events + subscription support
            <br />
            <a
              className="text-gray-700 underline dark:text-gray-400"
              href="https://github.com/trpc/examples-next-sse-chat"
              target="_blank"
              rel="noreferrer"
            >
              View Source on GitHub
            </a>
          </p>
        </header>

        <article className="space-y-2 p-4 text-sm text-gray-700 dark:text-gray-400">
          <h2 className="text-lg font-medium text-gray-950 dark:text-gray-50">
            Introduction
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Open inspector and head to Network tab</li>
            <li>All client requests are handled through HTTP</li>
            <li>
              We have a simple backend subscription on new messages that adds
              the newly added message to the current state
            </li>
          </ul>
        </article>

        <div className="mt-6 space-y-2 p-4">
          <Link
            href="/chat"
            className="text-gray-700 underline dark:text-gray-400"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
