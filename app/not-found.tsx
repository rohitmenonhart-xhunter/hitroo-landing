import Header from '@/components/corporate/Header';
import Footer from '@/components/corporate/Footer';
import { Button, Container } from '@/components/corporate/ui';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <Container className="py-32 lg:py-44">
          <p className="text-[13px] font-medium text-slate-500">404</p>
          <h1 className="mt-4 text-[40px] font-light tracking-[-0.035em] text-ink sm:text-[54px]">Page not found.</h1>
          <Button href="/" className="mt-10">
            Go home
          </Button>
        </Container>
      </main>
      <Footer />
    </>
  );
}
