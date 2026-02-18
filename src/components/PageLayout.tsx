import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}

const PageLayout = ({ children, showBreadcrumbs = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Header />
      <main className="flex-grow">
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
