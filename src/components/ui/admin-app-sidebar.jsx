
"use client";

import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IconDashboard,
  IconUsers,
  IconCalendarEvent,
  IconCreditCard,
  IconHeart,
  IconMoneybag,
  IconInnerShadowTop,
  IconUser,
  IconAlbum
} from "@tabler/icons-react";
import {  Clock, MessageSquare } from "lucide-react";


const navItems = [
  { title: "Dashboard", href: "/dash/admin", icon: IconDashboard },
  { title: "Profile", href: "/dash/admin/profile", icon: IconUser },
  { title: "Manage Users", href: "/dash/admin/manageusers", icon: IconUsers },
  { title: "Manage Bookings", href: "/dash/admin/managebookings", icon: IconCalendarEvent },
  { title: "Approve Hosts", href: "/dash/admin/approvehosts", icon: IconAlbum },
  { title: "Manage Reviews", href: "/dash/admin/managereviews", icon:  MessageSquare},
  // { title: "Recent Activity", href: "/dash/admin/recentactivity", icon: Clock },
  // { title: "Most Favorites", href: "/dash/admin/mostfavorites", icon: IconHeart },
];

export function AdminAppSidebar() {
  const { data: session } = useSession();
  const user = session?.user || { name: "Guest", email: "guest@example.com", avatar: "/avatars/shadcn.jpg" };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">EasyStay</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
