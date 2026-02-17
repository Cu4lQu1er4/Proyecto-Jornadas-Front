import EmployeeHeader from "./EmployeeHeader";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
  children: React.ReactNode;
};

export default function EmployeeLayoutShell({
  user,
  children,
}: Props) {
  return (
    <div className="min-h-screen flex flex-col gap-6 p-6 bg-background">
      <EmployeeHeader user={user} />
      {children}
    </div>
  );
}