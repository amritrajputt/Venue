"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Calendar,
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  Compass,
  ArrowLeftRight,
} from "lucide-react";

type DashboardSidebarProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  plan?: string;
};

export function DashboardSidebar({ user, plan = "Free" }: DashboardSidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const navItems = [
    {
      title: "Create Events",
      value: "create-events",
      icon: LayoutDashboard,
      href: "/dashboard/events",
    },
    {
      title: "Statistics",
      value: "stats",
      icon: BarChart3,
      href: "/dashboard/stats",
    },
    {
      title: "Profile",
      value: "profile",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200/80 dark:border-zinc-800/80">
     
      <SidebarHeader className="border-b border-zinc-200/40 dark:border-zinc-800/40 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <img
                  src="/4085.jpg"
                  alt="Venue Logo"
                  className="w-full h-full object-cover scale-150"
                />
              </span>
              <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold text-foreground text-lg">
                  Venue
                </span>
                <span className="truncate text-xxs font-medium text-muted-foreground">
                  {plan} Organizer
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400/80 uppercase tracking-wider text-[10px] font-bold mb-2 px-3">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href.startsWith("/dashboard?")
                  ? pathname === "/dashboard" && searchParams.get("tab") === item.value
                  : pathname === item.href || (item.value === "my-events" && pathname === "/dashboard" && !searchParams.get("tab"));
                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon className="size-4.5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200/40 dark:border-zinc-800/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden mb-4">
            <div className="flex items-center gap-3 px-2">
              <div className="size-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shrink-0">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-pink-500 to-violet-500 text-white">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {user.email}
                </p>
              </div>
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="size-4.5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}