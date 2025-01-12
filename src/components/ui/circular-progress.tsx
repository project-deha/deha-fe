'use client';

import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number;
    maxValue: number;
    size?: number;
    strokeWidth?: number;
    label?: string | number;
    className?: string;
    showPercentage?: boolean;
}

export function CircularProgress({
    value,
    maxValue,
    size = 120,
    strokeWidth = 10,
    label,
    className,
    showPercentage = false,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (value / maxValue) * circumference;
    const displayValue = showPercentage
        ? `${Math.round((value / maxValue) * 100)}%`
        : label;

    return (
        <div
            className={cn(
                'relative inline-flex items-center justify-center',
                className
            )}
        >
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-gray-200"
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
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {displayValue && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold">
                        {displayValue}
                    </span>
                </div>
            )}
        </div>
    );
}
