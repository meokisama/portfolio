export default function NotFound() {
  return (
    <main className="wrap grid min-h-svh place-items-center text-center">
      <div>
        <p className="jp text-lg tracking-[0.3em] text-shu">迷子</p>
        <h1 className="display mt-4 text-[clamp(5rem,22vw,18rem)]">404</h1>
        <p className="mt-4 text-ink-soft">This page was never inked.</p>
        <a href="/" className="pill mt-8">
          Back to the first page
        </a>
      </div>
    </main>
  );
}
