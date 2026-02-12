import AdminHeader from './AdminHeader';
import  AdminSidebar from './AdminSidebar';

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="p-2">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col"> 
        <div className="p-2">
          <AdminHeader />
        </div>

        <main className="flex-1 p-2">
          {children}
        </main>
      </div>
    </div>
  );
}