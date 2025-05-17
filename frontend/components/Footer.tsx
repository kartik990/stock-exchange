import {
  FaXTwitter,
  FaDiscord,
  FaLinkedin,
  FaRedditAlien,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className=" border-t bg-gray-900 border-slate-700 text-gray-300 px-6 pt-12 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red-600 rounded p-1">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-lg font-semibold">Exchange</span>
          </div>
          <p className="text-sm text-gray-400 mb-2">Copyright © 2025</p>
          <div className="flex gap-4 text-sm">
            <div className="cursor-pointer hover:text-white">Legal</div>
            <div className="cursor-pointer hover:text-white">Privacy</div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Help & Support</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-white cursor-pointer">Learn</li>
            <li className="hover:text-white cursor-pointer">Guide</li>
            <li className="hover:text-white cursor-pointer">Support</li>
            <li className="hover:text-white cursor-pointer">Documentation</li>
          </ul>
        </div>

        <div className="flex md:justify-end items-start gap-4 text-2xl">
          <FaXTwitter size={25} className=" hover:text-white cursor-pointer" />
          <FaDiscord size={25} className="hover:text-white cursor-pointer" />
          <FaLinkedin size={25} className="hover:text-white cursor-pointer" />
          <FaRedditAlien
            size={25}
            className="hover:text-white cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
}
