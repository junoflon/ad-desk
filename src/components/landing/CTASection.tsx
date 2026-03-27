import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          지금 가장 찾고 싶은
          <br />
          레퍼런스는 무엇인가요?
        </h2>
        <p className="text-text-secondary mb-10 text-lg">
          스니핏에서 원하는 광고 레퍼런스를 바로 만나보세요.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/search"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-medium transition-colors flex items-center gap-2 text-lg"
          >
            보고 싶은 레퍼런스 만나보기
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/blog"
            className="text-text-secondary hover:text-text-primary border border-border hover:border-border-light px-8 py-4 rounded-xl font-medium transition-colors"
          >
            스니핏로그 둘러보기
          </Link>
        </div>
      </div>
    </section>
  );
}
