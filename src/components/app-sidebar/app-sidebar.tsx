import { Link, useRouterState } from "@tanstack/react-router";
import {
	BarChart3Icon,
	ChartLineIcon,
	LayoutGridIcon,
	PieChartIcon,
	ReceiptIcon,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const currentYear = new Date().getFullYear().toString();
	const isOverviewActive = pathname === "/";
	const isExpenseActive = pathname.startsWith("/expense");
	const isTrendLineActive = pathname.startsWith("/insights/trend-line");
	const isCategoryBreakdownActive = pathname.startsWith(
		"/insights/category-breakdown",
	);
	const isMonthlySummaryActive = pathname.startsWith(
		"/insights/monthly-summary",
	);

	return (
		<Sidebar variant="inset" collapsible="offcanvas">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild isActive={isOverviewActive}>
							<Link to="/">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
									<LayoutGridIcon className="size-4" />
								</div>
								<div className="grid flex-1 text-left leading-tight">
									<span className="truncate font-semibold">
										Expense Tracker
									</span>
									<span className="text-sidebar-foreground/70 truncate text-xs">
										Google Sheets
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Overview</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isOverviewActive}>
									<Link to="/">
										<LayoutGridIcon />
										<span>Dashboard</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isExpenseActive}>
									<Link to="/expense">
										<ReceiptIcon />
										<span>Expenses</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isTrendLineActive}>
									<Link
										to="/insights/trend-line/$year"
										params={{ year: currentYear }}
									>
										<ChartLineIcon />
										<span>Trend line</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isCategoryBreakdownActive}>
									<Link
										to="/insights/category-breakdown/$year"
										params={{ year: currentYear }}
									>
										<PieChartIcon />
										<span>Category breakdown</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild isActive={isMonthlySummaryActive}>
									<Link
										to="/insights/monthly-summary/$year"
										params={{ year: currentYear }}
									>
										<BarChart3Icon />
										<span>Monthly summary</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Quick links</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === `/expense/${currentYear}`}
								>
									<Link to="/expense/$year" params={{ year: currentYear }}>
										<ReceiptIcon />
										<span>Expenses {currentYear}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={pathname === `/insights/trend-line/${currentYear}`}
								>
									<Link
										to="/insights/trend-line/$year"
										params={{ year: currentYear }}
									>
										<ChartLineIcon />
										<span>Trend line {currentYear}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={
										pathname === `/insights/category-breakdown/${currentYear}`
									}
								>
									<Link
										to="/insights/category-breakdown/$year"
										params={{ year: currentYear }}
									>
										<PieChartIcon />
										<span>Category breakdown {currentYear}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={
										pathname === `/insights/monthly-summary/${currentYear}`
									}
								>
									<Link
										to="/insights/monthly-summary/$year"
										params={{ year: currentYear }}
									>
										<BarChart3Icon />
										<span>Monthly summary {currentYear}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="bg-sidebar-accent text-sidebar-foreground/70 rounded-md px-3 py-2 text-xs">
					Data source: Google Sheets
					<div className="mt-1 text-[10px] uppercase tracking-wide">
						Shortcut: Ctrl/Cmd + B
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
