import ManageUsers from "./components/ManageUsers";

export const metadata = {
  title: 'Manage Users | Easy Stay Dashboard',
};

export default function ManageUsersPage() {
  return (
    <div className="min-w-sm">
      <ManageUsers/>
    </div>
  );
}
