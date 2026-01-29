import { Link, useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = {
	label: string;
	to?: string;
};

const segmentLabels: Record<string, string> = {
	expense: "Expenses",
	insights: "Insights",
	"trend-line": "Trend line",
};

function formatSegmentLabel(segment: string) {
	if (/^\d+$/.test(segment)) {
		return segment;
	}
	if (segmentLabels[segment]) {
		return segmentLabels[segment];
	}
	return segment
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function buildBreadcrumbs(pathname: string): Crumb[] {
	const segments = pathname.split("/").filter(Boolean);

	if (segments.length === 0) {
		return [{ label: "Dashboard" }];
	}

	const crumbs: Crumb[] = [{ label: "Dashboard", to: "/" }];
	let currentPath = "";

	for (const segment of segments) {
		currentPath += `/${segment}`;
		crumbs.push({
			label: formatSegmentLabel(segment),
			to: currentPath,
		});
	}

	if (crumbs.length > 0) {
		crumbs[crumbs.length - 1] = {
			label: crumbs[crumbs.length - 1].label,
		};
	}

	return crumbs;
}

export function AppSidebarHeader() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const breadcrumbs = buildBreadcrumbs(pathname);
	const currentTitle =
		breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";
	const breadcrumbNodes = breadcrumbs.flatMap((crumb, index) => {
		const nodes = [
			<BreadcrumbItem key={`${crumb.label}-${index}`}>
				{index === breadcrumbs.length - 1 ? (
					<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
				) : (
					<BreadcrumbLink asChild>
						<Link to={crumb.to ?? "/"}>{crumb.label}</Link>
					</BreadcrumbLink>
				)}
			</BreadcrumbItem>,
		];

		if (index < breadcrumbs.length - 1) {
			nodes.push(<BreadcrumbSeparator key={`${crumb.label}-sep-${index}`} />);
		}

		return nodes;
	});

	return (
		<header className="bg-background border-border flex h-16 items-center gap-3 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="data-[orientation=vertical]:h-4"
			/>
			<div className="flex min-w-0 flex-col">
				<div className="text-sm font-semibold">{currentTitle}</div>
				<Breadcrumb>
					<BreadcrumbList>{breadcrumbNodes}</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
