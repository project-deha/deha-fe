'use client';

import React from 'react';

interface AnimatedTitleProps {
    text: string;
    className?: string;
}

export default function AnimatedTitle({ text, className = '' }: AnimatedTitleProps) {
    return (
        <div className={`font-bold ${className} animate-shake text-black`}>
            {text}
        </div>
    );
} 