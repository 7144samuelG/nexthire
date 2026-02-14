"use client";

import {
  BrainIcon,
  LayoutDashboardIcon,
  BriefcaseIcon,
  UsersIcon,
  CalendarIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  Building2Icon,
  FileTextIcon,
  BarChart3Icon,
  UserPlusIcon,
  SparklesIcon,
  StarIcon,
  CreditCardIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
// import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";

const menuitems = [
  {
    title: "dashboard",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
      { title: "Post a Job", url: "/post-job", icon: BriefcaseIcon },
      { title: "Active Jobs", url: "/jobs", icon: FileTextIcon },
      { title: "Candidates", url: "/candidates", icon: UsersIcon },
      { title: "AI Screening", url: "/ai-screening", icon: SparklesIcon },
      { title: "Interviews", url: "/interviews", icon: CalendarIcon },
      { title: "Analytics", url: "/analytics", icon: BarChart3Icon },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const handlelogout = async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/dashboard" prefetch>
              <Image src="/logo.svg" alt="nexthire" width={30} height={30} />
              <span className="font-semibold text-sm">Nexthire</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuitems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              {group.items.map((item) => (
                <SidebarMenu key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip={group.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className="gap-x-4 px-4 h-10"
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="upgrade to pro"
              className="gap-x-4 px-4 h-10"
              onClick={() => {}}
            >
              <StarIcon className="h-4 w-4" />
              <span>Upgrade to pro</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing"
              className="gap-x-4 px-4 h-10"
              onClick={() => {}}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="logout"
              className="gap-x-4 px-4 h-10"
              onClick={handlelogout}
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
