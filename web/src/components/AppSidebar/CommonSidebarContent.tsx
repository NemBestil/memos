import { ExternalLinkIcon, GlobeIcon, InfoIcon } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useAppSidebar } from "@/contexts/AppSidebarContext";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/router/routes";
import { useTranslate } from "@/utils/i18n";
import { SIDEBAR_ROW_CLASSES, SidebarRowIconSlot, sidebarRowStateClasses } from "./SidebarRow";
import SidebarSection, { SIDEBAR_SECTION_STACK_CLASSES } from "./SidebarSection";

const CommonSidebarContent = () => {
  const t = useTranslate();
  const location = useLocation();
  const { setMobileOpen } = useAppSidebar();
  const aboutActive = Boolean(matchPath(ROUTES.ABOUT, location.pathname));

  return (
    <div className={SIDEBAR_SECTION_STACK_CLASSES}>
      <SidebarSection ariaLabel={t("common.about")}>
        <Link
          to={ROUTES.ABOUT}
          aria-current={aboutActive ? "page" : undefined}
          onClick={() => setMobileOpen(false)}
          className={cn(SIDEBAR_ROW_CLASSES, sidebarRowStateClasses(aboutActive ? "current" : "idle"))}
        >
          <SidebarRowIconSlot icon={InfoIcon} />
          <span className="min-w-0 flex-1 truncate">{t("common.about")}</span>
        </Link>
      </SidebarSection>

      <SidebarSection label={t("common.resources")}>
        <a
          href="https://nembestil.dk"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMobileOpen(false)}
          className={cn(SIDEBAR_ROW_CLASSES, sidebarRowStateClasses())}
        >
          <SidebarRowIconSlot icon={GlobeIcon} />
          <span className="min-w-0 flex-1 truncate">NemBestil.dk</span>
          <ExternalLinkIcon
            aria-hidden="true"
            className="size-3 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground/70"
            strokeWidth={1.8}
          />
        </a>
      </SidebarSection>
    </div>
  );
};

export default CommonSidebarContent;
