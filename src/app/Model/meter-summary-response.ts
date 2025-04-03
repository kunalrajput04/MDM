export interface MeterSummaryResponse {
    meterSummaries: MeterSummaries[],
    monthNames: string[],
    chartData: ChartData[]
}

export interface MeterSummaries {
    singlePhase: string,
    threePhase: string,
    ctMeter: string,
    htMeter: string,
    jio: string,
    airtel: string,
    totalMeterCount: string,
    monthName: string,
    year: number
}
export interface ChartData {
    name: string,
    count: number[]
}