"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { CardFooter } from "./ui/card";

interface IPagintionProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: IPagintionProps) {
  return (
    <div>
      <CardFooter className="flex justify-center space-x-2 border-t border-gray-800 pt-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="text-gray-400 hover:text-gray-800 disabled:opacity-50"
        >
          Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            onClick={() => setCurrentPage(page)}
            className={cn(
              page === currentPage
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-800"
            )}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-gray-400 hover:text-gray-800 disabled:opacity-50"
        >
          Next
        </Button>
      </CardFooter>
    </div>
  );
}
