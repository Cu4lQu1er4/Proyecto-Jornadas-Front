type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function EmployeeLayoutShell({
  header,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {header}

      <main className="flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  )
}