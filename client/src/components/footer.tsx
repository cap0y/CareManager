import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 py-4 px-4 mt-6 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/images/carelink.png"
                alt="케어링크 로고"
                className="h-8 w-auto select-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center md:text-left">
              © 2025 케어링크. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <Link href="/shop">
              <span className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                쇼핑몰
              </span>
            </Link>
            <Link href="/search">
              <span className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                케어 매니저
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                개인정보 보호
              </span>
            </Link>
            <Link href="/support">
              <span className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                고객 지원
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
