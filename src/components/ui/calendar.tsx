"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { tr } from "date-fns/locale";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date(); // Bugünün tarihi

  return (
    <div className={`flex justify-center items-center p-4 bg-white shadow-md border rounded-lg ${className}`}>
      <DayPicker
        locale={tr}
        showOutsideDays={showOutsideDays}
        disabled={{ before: today }} // Bugünden önceki tarihleri devre dışı bırak
        className="text-sm"
        modifiersClassNames={{
          selected: "bg-blue-600 text-white rounded-full",
          today: "bg-gray-200 font-bold",
          range_start: "bg-blue-500 text-white rounded-l-full",
          range_end: "bg-blue-500 text-white rounded-r-full",
          range_middle: "bg-blue-100 text-blue-700",
        }}
        components={{
          Navbar: ({ onNextClick }) => (
            <div className="flex justify-end p-2">
              <button
                onClick={onNextClick}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ),
        }}
        {...props}
      />

    </div>
  );
}
