import React from 'react'

import { Skeleton } from '@/src/components/ui/skeleton'

interface ListSkeletonProps {
    items?: number
    showAvatar?: boolean
    showActions?: boolean
    showSubtext?: boolean
    className?: string
}

export default function ListSkeleton({
    items = 5,
    showAvatar = true,
    showActions = false,
    showSubtext = true,
    className
}: ListSkeletonProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: items }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg border">
                    {showAvatar && (
                        <Skeleton className="size-10 rounded-full flex-shrink-0" />
                    )}

                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        {showSubtext && (
                            <Skeleton className="h-3 w-1/2" />
                        )}
                    </div>

                    {showActions && (
                        <div className="flex gap-2">
                            <Skeleton className="size-8 rounded" />
                            <Skeleton className="size-8 rounded" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
} 