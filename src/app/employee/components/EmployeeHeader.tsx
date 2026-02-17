import UserMenu from "@/components/UserMenu";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
};

export default function EmployeeHeader({ user }: Props) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <header 
      className="
        bg-surface border border-border rounded-2xl flex items-center
        justify-between mx-6 p-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-text">
          Mi jornada
        </h1>

        <p className="text-sm text-text-muted">
          {fullName} · {user.role}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu user={user} basePath="/employee" />
      </div>
    </header>
  );
}