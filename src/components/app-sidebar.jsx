"use client";

import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IconDashboard,
  IconUsers,
  IconHistory,
  IconCalendarEvent,
  IconCreditCard,
  IconHeart,
  IconMoneybag,
  IconInnerShadowTop
} from "@tabler/icons-react";

const navItems = [
  
  { title: "Profile", href: "/dashboard/guest/profile", icon: IconUsers },
  { title: "Review", href: "/dashboard/guest/review", icon: IconHistory },
  { title: "Bookings", href: "/dashboard/guest/bookings", icon: IconCalendarEvent },
 
  { title: "Payment", href: "/dashboard/guest/payments", icon: IconCreditCard },

];

export function AppSidebar() {
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
             <div className="flex justify-start items-center px-4">
                  <LogOutIcon/>
                  <button    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 font-semibold cursor-pointer w-20  text-sm transition-colors" )} onClick={()=>signOut({callbackUrl:`${baseUrl}/login`})}>
                  Logout
                </button>
                </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
