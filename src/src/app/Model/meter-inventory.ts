export interface MeterInventory {
    meterType: string,
    supplier: string,
    chalanNo: string,
    totalStock: number,
    liveStock: number,
    faultStock: number,
    returnStock: number,
    receivedStock: number,
    descriptions: string
}


export interface MeterInventoryList {
    inventoryId: number,
    meterType: string,
    supplier: string,
    chalanNo: string,
    totalStock: number,
    liveStock: number,
    faultStock: number,
    returnStock: number,
    receivedStock: number,
    descriptions: string,
    created: Date,
    createdBy: string
}

export interface InventoryDashboard {
    meterType: string,
    created: Date,
    total: number,
    liveStock: number
}

export interface InventoryDashboardInfo {
    total: number,
    live: number,
    inventoryDashboards: InventoryDashboard[]
}


export interface MeterReturn {
    supplierName: string,
    chalanNo: string,
    meterType: string,
    meterCategory: string,
    meterCount: number,
    returnType: string,
    comments: string
}

export interface MeterReceived {
    supplier: string,
    chalan: string,
    type: string,
    category: string,
    count: number,
    return: string,
    comment: string
}

export interface MeterReturnList {
    supplierName: string,
    chalanNo: number,
    meterType: string,
    meterCategory: string,
    meterCount: number,
    returnType: string,
    lastUpdated: Date
}

export interface PhysicalStock {
    meterType: string,
    supplier: string,
    ok: number,
    fault: number,
    stockId: number
}


export interface PhysicalStockList {
    meterType: string,
    meterManufacture: string,
    faultyCount: number,
    okCount: number
    totalCount: number
}

export interface StockFilter {
    meterType: string,
    meterManufacture: string,
    simType: string,
    meterStatus: string
}
export interface InventoryStock {
    type: string,
    live: number,
    received: number,
    return: number,
    ok: number,
    faulty: number,
    pending: number,
    total: number
}


export interface MeterCount {
    totalAvilable: number,
    installed: number,
    totalJio: number,
    totalAirtel: number,
    faultyMeter: number

}