import React from 'react'

import { Skeleton } from '../skeleton'

interface TableSkeletonProps {
    rows?: number
    columns?: number
    cols?: number // Alias para columns para compatibilidad
    showHeader?: boolean
    className?: string
}

export default function TableSkeleton({
    rows = 5,
    columns,
    cols,
    showHeader = true,
    className
}: TableSkeletonProps) {
    // Usar cols si se proporciona, si no usar columns, si no usar 4
    const numColumns = cols ?? columns ?? 4

    return (
        <div className={`rounded-lg border ${className}`}>
            {/* Header del table */}
            {showHeader && (
                <div className="border-b bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
                        {Array.from({ length: numColumns }, (_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            )}

            {/* Filas del table */}
            <div className="divide-y">
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <div key={rowIndex} className="p-4">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
                            {Array.from({ length: numColumns }, (_, colIndex) => (
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