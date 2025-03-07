import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import {
  IoMdNotificationsOutline,
} from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { useStore } from "components/StoreContext";
import { useAuth } from "components/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";


const Navbar = (props) => {
  const navigate = useNavigate()
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(
    localStorage.getItem("darkMode") === "enabled"
  );
  const { storeId, setStoreId, stores, fetchStores } = useStore();
  const { name, logout } = useAuth()

  React.useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  React.useEffect(() => {
    if (darkmode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkmode]);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <Dropdown
          button={
            <div className="flex h-full items-center rounded-full cursor-pointer bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[178px]">
              <p className="pl-3 pr-2 text-lg font-medium">
                {storeId
                  ? stores.find((store) => store._id === storeId)?.name || "Select Store"
                  : "Select Store"}
              </p>
            </div>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Select Store
                </p>
              </div>
              {stores && stores.map((store) => (
                <button
                  key={store._id}
                  className="flex w-full items-center p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-white/20 dark:active:bg-white/10"
                  onClick={() => setStoreId(store._id)}
                >
                  <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                    <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                      {store.name}
                    </p>
                    <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                      {store.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div className="flex items-center gap-2">
          <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          <Switch.Root
            className="relative w-10 h-5 bg-gray-300 rounded-full data-[state=checked]:bg-navy-600 dark:data-[state=checked]:bg-white transition-all"
            checked={darkmode}
            onCheckedChange={(checked) => {
              setDarkmode(checked);
              document.body.classList.toggle("dark", checked);
              localStorage.setItem("darkMode", checked ? "enabled" : "disabled");
            }}
          >
          <Switch.Thumb className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform data-[state=checked]:left-5 dark:bg-navy-800" />
          </Switch.Root>
          <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
        </div>

        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <MdAccountCircle className="h-10 w-10 rounded-full cursor-pointer text-gray-400 dark:text-white"/>
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey {name},
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href="profile"
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <button
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in text-left"
                  onClick={() => {
                      logout();
                      navigate("/");
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
