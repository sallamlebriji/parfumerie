import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";

export const NotFoundPage = ({ type = "notFound" }) => {
  const { t } = useTranslation();
  usePageTitle(t(`${type}.title`));
  return (
    <main className="pb-24">
      <PageHeader eyebrow={type === "denied" ? "403" : "404"} title={t(`${type}.title`)} text={t(`${type}.text`)} />
      <div className="page-shell pt-10">
        <Button as={Link} to="/">{t("notFound.home")}</Button>
      </div>
    </main>
  );
};
