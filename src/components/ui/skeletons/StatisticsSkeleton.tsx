import React from 'react'

import { Card, CardContent } from '@/src/components/ui/card'
import { Skeleton } from '@/src/components/ui/skeleton'

interface StatisticsSkeletonProps {
    cards?: number
    showIcons?: boolean
    className?: string
}

export default function StatisticsSkeleton({
    cards = 4,
    showIcons = true,
    className
}: StatisticsSkeletonProps) {
    return (
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
            {Array.from({ length: cards }, (_, i) => (
                <Card key={i}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            {showIcons && (
                                <Skeleton className="size-12 rounded-full" />
                            )}
                        </div>
                        <div className="mt-4">
                            <Skeleton className="h-2 w-full rounded" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
} 