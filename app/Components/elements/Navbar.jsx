"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserDetails } from "../../hooks/useUser";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "/assets/dash-in.svg" },
  {
    name: "Profile",
    href: "/profile",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        width={20}
        height={20}
      >
        <path
          fill="grey"
          d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"
        />
      </svg>
    ),
  },
  { name: "Calender", href: "/calender", icon: "/assets/message-in.svg" },
  { name: "Properties", href: "/property", icon: "/assets/arro-in.svg" },
  { name: "Teams", href: "/teams", icon: "/assets/team.svg" },
  { name: "Referrals", href: "/referrals", icon: "/assets/agent-in.svg" },
  { name: "Messages", href: "/messages", icon: "/assets/review-in.svg" },
  { name: "Reviews", href: "/reviews", icon: "/assets/review-in.svg" },
  { name: "Contract", href: "/contract", icon: "/assets/review-in.svg" },
  { name: "Board", href: "/board", icon: "/assets/review-in.svg" },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const { data: user } = useUserDetails(userId);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    // remove userId
    router.push("/login"); // redirect to login page
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex bg-[#F4F9FD] items-center justify-between xl:gap-10 gap-2 sm:gap-4 w-full">
        {/* <div className='flex items-center md:w-[40%] sm:w-[50%] w-[80%] bg-white px-4 py-3 rounded-lg '>
					<Image src='/assets/search.svg' alt='Search' width={16} height={16} />
					<input
						type='text'
						placeholder='Search goods...'
						className='outline-none w-full text-gray-700 ml-2'
					/>
				</div> */}
        {/* profile */}
        <div className="sm:flex items-center hidden gap-3 bg-white px-4 py-1 rounded-lg shadow-sm">
          <img
            src={user?.profileImage || "/assets/dumy.png"}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          {user?.firstName && user?.lastName ? (
            <span className="md:font-[700] md:text-[16px] text-[15px] font-[500] min-w-max text-[#0A1629]">
              {user.firstName + " " + user.lastName}
            </span>
          ) : (
            <span className="text-[#0A1629]"></span>
          )}
        </div>

        <div className="flex justify-end gap-4 items-center">
          {/* toggler */}
          <button
            ref={toggleButtonRef}
            className="bg-white p-3 sm:hidden rounded-lg shadow-sm"
            onClick={toggleDropdown}
          >
            <MdOutlineDashboard size={21} />
          </button>

          {/* dropdown for mobile */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-[60px] right-2 w-56 bg-white shadow-lg rounded-xl z-50 sm:hidden"
            >
              <ul className="flex flex-col gap-2 p-3">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F4F9FD] transition-all text-gray-800"
                      onClick={closeDropdown}
                    >
                      {/* check if icon is string or JSX */}
                      {typeof item.icon === "string" ? (
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                      ) : (
                        item.icon
                      )}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}

                {/* Logout Button Only for Mobile */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-2 w-full rounded-md hover:bg-[#F4F9FD] transition-all text-gray-800"
                  >
                    <Image
                      src="/assets/logout.svg"
                      alt="Logout"
                      width={20}
                      height={20}
                    />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* logout button */}

          <button
            onClick={handleLogout}
            className="bg-white px-4 py-2 rounded-lg shadow-sm text-[#E23442] font-medium hover:bg-red-50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
