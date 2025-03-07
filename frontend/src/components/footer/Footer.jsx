const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between px-1 pb-8 pt-3 lg:px-8 xl:flex-row">
      <p className="mb-4 text-center text-sm text-gray-600 sm:!mb-0 md:text-base">
        ©{new Date().getFullYear()} AB Software Solutions. All Rights Reserved.
      </p>
      <p className="text-xs text-gray-600 text-center max-w-md">
        AI-generated insights are provided for informational purposes only and  may not be 100% accurate. Users are responsible for how they interpret and act on the data.
      </p>
      <div>
        <ul className="flex flex-wrap items-center gap-3 sm:flex-nowrap md:gap-10">
          <li>
            <a
              target="_blank"
              href="mailto:badawy.am@gmail.com"
              className="text-base font-medium text-gray-600 hover:text-gray-600"
            >
              Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
