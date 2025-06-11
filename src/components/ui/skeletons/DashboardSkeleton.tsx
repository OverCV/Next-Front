import React from 'react'

import { CardSkeleton, TableSkeleton, StatisticsSkeleton } from './index'

interface DashboardSkeletonProps {
    showStats?: boolean
    showTable?: boolean
    showCards?: boolean
    statsCount?: number
    tableRows?: number
    tableCols?: number
    cardsCount?: number
}

export default function DashboardSkeleton({
    showStats = true,
    showTable = true,
    showCards = false,
    statsCount = 4,
    tableRows = 5,
    tableCols = 6,
    cardsCount = 3
}: DashboardSkeletonProps) {
    return (
        <div className="space-y-6">
            {/* Estadísticas */}
            {showStats && (
                <StatisticsSkeleton count={statsCount} />
            )}

            {/* Tabla */}
            {showTable && (
                <TableSkeleton rows={tableRows} cols={tableCols} />
            )}

            {/* Cards */}
            {showCards && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: cardsCount }).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            )}
        </div>
    )
} 