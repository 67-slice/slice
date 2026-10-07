"use client";

import ModalBackground from "@/components/common/popup-modal/ModalBackground";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useDeviceSize } from "@/hooks/useDeviceSize";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface NoteDetailModalProps {
  children: React.ReactNode;
}

export default function NoteDetailModal({ children }: NoteDetailModalProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const { isDesktop } = useDeviceSize();

  const handleClose = () => {
    setIsAnimating(false);

    if (!isDesktop) {
      return router.back();
    }

    setTimeout(() => router.back(), 300);
  };

  useEffect(() => {
    const timerId = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <ModalBackground onClick={handleClose} />
      <div
        className={clsx(
          "fixed inset-y-0 right-0 left-0 z-1000 bg-white px-4 pt-12 pb-4",
          "overflow-y-auto",
          "translate-x-0 transition-transform duration-300 ease-out",
          "sm:px-10 sm:pt-18 sm:pb-10 lg:left-auto lg:w-5xl lg:rounded-tl-4xl lg:rounded-bl-4xl lg:pt-20",
          !isAnimating && "lg:translate-x-full",
        )}>
        <button
          type="button"
          aria-label="닫기"
          onClick={handleClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-400 sm:top-10 sm:right-10">
          <XMarkIcon
            strokeWidth={1.8}
            className="h-6 w-6"
          />
        </button>
        {children}
      </div>
    </>
  );
}
