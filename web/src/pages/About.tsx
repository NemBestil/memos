import MemosLogo from "@/components/MemosLogo";
import { Badge } from "@/components/ui/badge";
import { useInstance } from "@/contexts/InstanceContext";
import { MEMOS_WEBSITE_URL } from "@/lib/constants";
import { useTranslate } from "@/utils/i18n";

const DEFAULT_TITLE = "Memos";

const About = () => {
  const t = useTranslate();
  const { profile, generalSetting } = useInstance();

  const customProfile = generalSetting.customProfile;
  const instanceTitle = customProfile?.title || DEFAULT_TITLE;
  const isCustomBranded = instanceTitle !== DEFAULT_TITLE;

  return (
    <section className="min-h-full w-full">
      <div className="mx-auto w-full max-w-5xl py-8 sm:py-16">
        <header className="min-w-0">
          <div className="space-y-3">
            <MemosLogo as="h1" size="hero" />
            {profile.demo && <Badge variant="warning">{t("about.demo")}</Badge>}
          </div>
          <p className="mt-6 whitespace-pre-line text-3xl leading-tight tracking-tight wrap-anywhere text-foreground sm:text-4xl">
            {customProfile?.description || "Simple note-taking for your everyday thoughts."}
          </p>
        </header>
        {isCustomBranded && (
          <footer className="mt-8 border-t border-border pt-5">
            <a
              className="text-[13px] text-muted-foreground hover:text-foreground focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              href={MEMOS_WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t("about.powered-by")}
            </a>
          </footer>
        )}
      </div>
    </section>
  );
};

export default About;
