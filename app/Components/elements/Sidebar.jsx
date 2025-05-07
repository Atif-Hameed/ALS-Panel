"use client";
import { AgentIcon, EnvelopIcon, HomeIcon, ProfileIcon, PropertyIcon, TeamIcon } from "../../../public/assets/svgs/index";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // 🛠️ usePathname needed!

const menuItems = [
  { name: "Dashboard", href: "/dashboard", Icon: HomeIcon },
  { name: "Profile", href: "/profile", Icon: ProfileIcon },
  { name: "Calender", href: "/calender", Icon: EnvelopIcon },
  { name: "Properties", href: "/property", Icon: PropertyIcon },
  { name: "Teams", href: "/teams", Icon: TeamIcon },
  { name: "Referrals", href: "/referrals", Icon: AgentIcon },
  { name: "Reviews", href: "/reviews", Icon: EnvelopIcon },
  { name: "Contract", href: "/contract", Icon: EnvelopIcon },
  { name: "Board", href: "/board", Icon: EnvelopIcon },
  { name: "Messages", href: "/messages", Icon: EnvelopIcon },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="h-[95vh] scroll-containery overflow-auto bg-[#002B4B] lg:w-[200px] sm:w-[90px] shadow-md flex flex-col items-center py-6 rounded-2xl transition-all duration-300">
      {/* Logo */}
      <div className="mb-6">
        <Link href={'/'}>
        <Image
          src="/assets/ALS-Logo.svg"
          className="w-[70px] h-[50px] md:h-[68px] md:w-[112px]"
          alt="Logo"
          width={112}
          height={68}
        />
        </Link>
      </div>

      {/* Menu Items */}
      <div className="w-full px-4 flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.Icon; // 👈 Get the icon component
          return (
            <Link
              href={item.href}
              key={index}
              className={`flex items-center group w-full px-4 h-[44px] rounded-[10px] text-[16px] font-[700] transition-all duration-200
                ${isActive ? "bg-[#475569] text-white" : "text-[#7D8592] hover:text-white hover:bg-[#475569]"}
              `}
            >
              <Icon className={`w-6 h-6 group-hover:text-white ${isActive ? "text-white" : "text-[#7D8592]"}`} />
              <span className="ml-3 hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-grow"></div>
    </div>
  );
};

export default Sidebar;
