'use client'
import Link from 'next/link';

const Header = () => {
  
  return (
    <>
      <div className="w-full bg-white">
        <header className="relative px-2 py-4 w-full bg-[#ffffff]">
          <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 lg:px-16 lg:py-5">
            <Link href='/' className="flex items-center text-xl font-bold text-black">
                Rescript
            </Link>
          </nav>
        </header>
      </div>

    </>
  );
};

export default Header;