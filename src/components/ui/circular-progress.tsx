'use client';

import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number;
    maxValue?: number;
    label?: string;
    size?: number;
    strokeWidth?: number;
}

export function CircularProgress({
    value,
    maxValue = 10,
    label,
    size = 120,
    strokeWidth = 12,
}: CircularProgressProps) {
    const range = maxValue - value;
    const percentage = (range / maxValue) * 100;

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">

            <svg
                className="transform rotate-90"
                style={{ width: size, height: size }}
            >
                <circle
                    className="text-primary/20"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-primary transition-all duration-300 ease-in-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-semibold">{value.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">ve üzeri</span>
            </div>

            <div className="absolute bottom-0 w-full flex justify-center">
                <div className="flex flex-col items-center -mb-1">
                    <div className="w-[2px] h-[8px] bg-muted-foreground/30 rounded-full mb-1" />
                    <span className="text-sm text-white">10/0</span>
                </div>
            </div>
        </div>
    );
}
