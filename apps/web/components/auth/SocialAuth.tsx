import React from "react";
import { Button } from "../ui/button";
import { FaLinkedinIn, FaGoogle } from "react-icons/fa";

const SocialAuth = () => {
  return (
    <div className="mb-6 flex gap-3">
      <Button
        variant="outline"
        className="flex-1 gap-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      >
        <FaLinkedinIn className="h-4 w-4 text-[#0077B5]" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        className="flex-1 gap-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
      >
        <FaGoogle className="h-4 w-4 text-[#EA4335]" />
        Google
      </Button>
    </div>
  );
};

export default SocialAuth;
