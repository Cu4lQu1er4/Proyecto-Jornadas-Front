import AdminHeader from './AdminHeader';
import  AdminSidebar from './AdminSidebar';

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
  children: React.ReactNode;
};

export default function AdminLayoutShell({
  user,
  children,
}: Props) {
  return (
    <div className="min-h-screen flex">
      <div className="p-2">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col"> 
        <div className="p-2">
          <AdminHeader user={user}/>
        </div>

        <main className="flex-1 p-2">
          {children}
        </main>
      </div>
    </div>  
  );
}