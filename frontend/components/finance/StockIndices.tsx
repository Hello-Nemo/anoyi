import Link from 'next/link'
import useStockRealData from '../../hooks/useStockRealData'

export default function StockIndices() {

    const code = [
        '000001.SS',
        '399001.SZ',
        '399006.SZ',
        '000300.SS',
        '000905.SS',
        '000688.SS',
    ]

    const fields = [
        'prod_code',
        'prod_name',
        'price_precision',
        'update_time',
        'last_px',
        'px_change',
        'px_change_rate',
        'trade_status'
    ]

    const { realData } = useStockRealData(code, fields)

    const getTextColor = (num: number) => {
        if (num > 0) return 'text-red-600'
        if (num == 0) return 'text-gray-600'
        return 'text-green-600'
    }

    const format = (num: number) => {
        if (num > 0) return `+${num.toFixed(2)}`
        return num.toFixed(2)
    }

    return (
        <div className="grid grid-cols-6 gap-4 w-full text-white">
            {
                code.map((item, index) => {
                    if (Object.keys(realData.snapshot).length > 0) {
                        const stock = realData.snapshot[item]
                        const stockObj = Object.fromEntries(realData.fields.map((_, i) => [realData.fields[i], stock[i]]))
                        return (
                            <Link href={`/finance/${item}`}>
                                <div key={index} className={`cursor-pointer rounded-lg w-full flex flex-col shadow-lg gap-1 py-4 justify-center items-center bg-white ${getTextColor(stockObj['px_change'] as number)}`}>
                                    <span className='text-sm text-gray-900'>{stockObj['prod_name']}</span>
                                    <span className='text-3xl font-semibold'>{(stockObj['last_px'] as number).toFixed(2)}</span>
                                    <div className='flex flex-row gap-2 text-sm'>
                                        <span>{format(stockObj['px_change'] as number)}</span>
                                        <span>{format(stockObj['px_change_rate'] as number)}%</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                })
            }
        </div>
    )

}
