import HostApplicationModal from "@/components/HostApplicationModal/HostApplicationModal";

export default function BecomeHostPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
      <h1 className="text-2xl font-semibold mb-6">Apply to Become a Host</h1>
      <HostApplicationModal />
    </div>
  );
}