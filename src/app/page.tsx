import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7f4] flex flex-col">
      <header className="bg-primary text-primary-foreground w-full py-6 shadow-lg">
        <h1 className="text-center text-3xl font-extrabold tracking-wide">
          Easerve에 오신 것을 환영합니다
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-6xl font-extrabold text-primary leading-tight">
              예약 시스템을<br />간단하게
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Easerve는 사장님들이 예약 시스템을 간편하게 관리할 수 있도록
              도와줍니다. 시간을 절약하고 고객 만족도를 높여보세요.
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/iriondaengdaeng">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold py-4 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                지금 시작하기
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-90">&copy; {new Date().getFullYear()} Easerve. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
