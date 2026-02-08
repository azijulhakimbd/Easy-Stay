import React from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";

const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-white dark:bg-black">
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Top section */}
          <div className="md:flex md:justify-between md:items-start">
            {/* Logo + description */}
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold">
                <img src="ES  LOGO.png" alt="Logo" width={50} height={50} />
                EasyStay
              </h2>
              <p className="mt-2 font-body max-w-xs">
                Discover and book amazing short-term stays around the world.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 gap-8 sm:gap-12 md:flex md:space-x-12">
              <div>
                <h3 className="text-md font-heading font-semibold tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 font-heading space-y-2">
                  <li>
                    <Link href="/stays" className="hover:underline">
                      Stays
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:underline">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="hover:underline">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:underline">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-semibold tracking-wider font-heading uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-2 font-body">
                  <li>
                    <Link href="/help-center" className="hover:underline">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row md:justify-between md:items-center">
            {/* Copyright */}
            <p className="text-sm">
              &copy; {new Date().getFullYear()} easyStay. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="mt-4 md:mt-0 flex space-x-6">
              {/* <Link href="https://facebook.com" target="_blank" className="">
                <FaFacebookF className="w-5 h-5" />
              </Link> */}
              <Link
                href="https://devops-team.vercel.app/"
                target="_blank"
                className=""
              >
                <TfiWorld className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com/azijulhakimbd/Easy-Stay"
                target="_blank"
                className=""
              >
                <FaGithub className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
