export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
      <header className="border-b p-4">
        <h1 className="text-3xl font-bold">My Todos</h1>
      </header>
      <main>
        <div className="flex-1 p-4">{children}</div>
      </main>
    </div>
  );
}
