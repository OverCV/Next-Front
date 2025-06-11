import React from 'react'

import { Skeleton } from '../skeleton'

interface TableSkeletonProps {
    rows?: number
    columns?: number
    showHeader?: boolean
    className?: string
}

export default function TableSkeleton({
    rows = 5,
    columns = 4,
    showHeader = true,
    className
}: TableSkeletonProps) {
    return (
        <div className={`rounded-lg border ${className}`}>
            {/* Header del table */}
            {showHeader && (
                <div className="border-b bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                        {Array.from({ length: columns }, (_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            )}

            {/* Filas del table */}
            <div className="divide-y">
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div key={rowIndex} className="p-4">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                            {Array.from({ length: columns }, (_, colIndex) => (
                                <Skeleton
                                    key={colIndex}
                                    className={`h-4 ${colIndex === 0 ? 'w-3/4' : 'w-full'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 