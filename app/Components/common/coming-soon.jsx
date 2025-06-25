"use client";

const ComingSoon = () => {
  return (
    <div className="h-screen w-full bg-[#F4EBD0] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-extrabold text-black animate-pulse">
          🚀 Coming Soon
        </h1>
        <p className="text-xl text-[#D6AD60]">
          Something awesome is on its way!
        </p>
        <p className="text-sm text-[#A57D2C]">
          Stay tuned and check back soon.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
