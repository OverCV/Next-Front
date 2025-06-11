import React from 'react'

import { Skeleton } from '@/src/components/ui/skeleton'
import CardSkeleton from './CardSkeleton'
import StatisticsSkeleton from './StatisticsSkeleton'
import TableSkeleton from './TableSkeleton'

interface DashboardSkeletonProps {
    showStats?: boolean
    showCards?: boolean
    showTable?: boolean
    className?: string
}

export default function DashboardSkeleton({
    showStats = true,
    showCards = true,
    showTable = true,
    className
}: DashboardSkeletonProps) {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header del dashboard */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Estadísticas */}
            {showStats && (
                <StatisticsSkeleton cards={4} />
            )}

            {/* Sección de cards */}
            {showCards && (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }, (_, i) => (
                            <CardSkeleton
                                key={i}
                                showActions
                                contentLines={4}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tabla de datos */}
            {showTable && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <TableSkeleton rows={8} columns={5} />
                </div>
            )}
        </div>
    )
} 