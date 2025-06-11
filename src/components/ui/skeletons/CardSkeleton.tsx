import React from 'react'

import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { Skeleton } from '@/src/components/ui/skeleton'

interface CardSkeletonProps {
    showHeader?: boolean
    showAvatar?: boolean
    showActions?: boolean
    contentLines?: number
    className?: string
}

export default function CardSkeleton({
    showHeader = true,
    showAvatar = false,
    showActions = false,
    contentLines = 3,
    className
}: CardSkeletonProps) {
    return (
        <Card className={className}>
            {showHeader && (
                <CardHeader>
                    <div className="flex items-center gap-3">
                        {showAvatar && (
                            <Skeleton className="size-10 rounded-full" />
                        )}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        {showActions && (
                            <Skeleton className="size-8 rounded" />
                        )}
                    </div>
                </CardHeader>
            )}
            <CardContent>
                <div className="space-y-3">
                    {Array.from({ length: contentLines }, (_, i) => (
                        <Skeleton
                            key={i}
                            className={`h-3 ${i === contentLines - 1 ? 'w-2/3' : 'w-full'
                                }`}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
} 