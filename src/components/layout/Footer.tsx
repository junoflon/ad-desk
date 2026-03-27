import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-text-primary">
                SNIPIT
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              찾고싶을 때 찾아지는 광고 레퍼런스 플랫폼
            </p>
            <div className="text-text-muted text-xs space-y-1">
              <p>(주) 위시스트 | 대표: 홍길동</p>
              <p>사업자등록번호: 000-00-00000</p>
              <p>서울특별시 관악구</p>
              <p>support@snipit.im | 070-0000-0000</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-text-primary font-semibold text-sm mb-4">
              서비스
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/search"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                레퍼런스 검색
              </Link>
              <Link
                href="/monitor"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                경쟁사 모니터링
              </Link>
              <Link
                href="/board"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                보드
              </Link>
              <Link
                href="/pricing"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                플랜 안내
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-text-primary font-semibold text-sm mb-4">
              정보
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/blog"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                스니핏로그
              </Link>
              <Link
                href="/faq"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="#"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="#"
                className="text-text-muted hover:text-text-secondary text-sm transition-colors"
              >
                개인정보 처리방침
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-text-muted text-xs">
            &copy; 2026 SNIPIT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
