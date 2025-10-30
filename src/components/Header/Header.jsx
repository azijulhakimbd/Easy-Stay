"use client";
import LinkBtn from "@/app/Components/customButton/CustomButton";
import SignOutBtn from "@/app/Components/customButton/SignoutBtn";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
console.log(session?.user?._id)
  const userNotExits = (
    <div className="flex items-center gap-4">
      <NavbarButton href={"/login"}>Login</NavbarButton>
      <LinkBtn href="/signup">Signup</LinkBtn>
    </div>
  );

  const userExits = (
    <div className="flex justify-center items-center gap-4">
      <Avatar>
        <AvatarImage src={session?.user?.image || '' } />
        <AvatarFallback>PF</AvatarFallback>
      </Avatar>
      <SignOutBtn onClick={() => signOut()} href="#">
        Logout
      </SignOutBtn>
    </div>
  );

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Stays", link: "/stays" },
    ...(session?.user?.role === "user"
      ? [{ name: "Dashboard", link: "/dashboard/guest" }] : session?.user?.role === "host"
      ? [{ name: "Dashboard", link: "/host" }] : session?.user?.role === "admin" ? [{name:"Dashboard",link:"/dash/admin"}] :[]),
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "Be a Host", link: "/become-a-host" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems className="text-lg text-gray-700" items={navItems} />
          {session ? userExits : userNotExits}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-white text-gray-700"
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative block text-gray-700 hover:text-gray-900"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {session ? userExits : userNotExits}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
