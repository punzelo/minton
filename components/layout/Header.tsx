import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="text-lg font-bold text-court-900" href="/">
          Badminton Bracket
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link className="text-slate-600 hover:text-court-700" href="/admin">
            대시보드
          </Link>
          <Link className="text-slate-600 hover:text-court-700" href="/login">
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
