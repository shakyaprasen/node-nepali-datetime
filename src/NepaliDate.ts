import dateConverter from "./dateConverter"
import format from "./format"


function parse(dateString: string): number[] {
    // Expected date formats are yyyy-mm-dd, yyyy.mm.dd yyyy/mm/dd
    const parts: string[] = dateString.split(/[-./]/, 3)
    const [year, month = 1, day = 1] = parts.map((d) => {
        const n = parseInt(d, 10)
        if (Number.isNaN(n)) {
            throw new Error("Invalid date")
        }
        return n
    })

    return [year, month - 1, day]
}

class NepaliDate {
    timestamp: Date
    year: number
    month: number
    day: number
    static minimum: () => Date
    static maximum: () => Date

    constructor(...args: any[]) {
        if (args.length === 0) {
            this.setEnglishDate(new Date())
        } else if (args.length === 1) {
            const e = args[0]
            if (typeof e === "object") {
                if (e instanceof Date) {
                    this.setEnglishDate(e)
                } else if (e instanceof NepaliDate) {
                    this.timestamp = e.timestamp
                    this.year = e.year
                    this.month = e.month
                    this.day = e.day
                } else if (typeof e === "number") {
                    this.setEnglishDate(new Date(e))
                } else {
                    throw new Error("Invalid date argument")
                }
            } else if (typeof e === "string") {
                // Try to parse the date
                this.set.apply(this, parse(e))
            } else {
                throw new Error("Invalid date argument")
            }
        } else if (args.length === 3) {
            this.set(args[0], args[1], args[2])
        } else {
            throw new Error("Invalid argument syntax")
        }
    }

    /**
     * Sets the English date and optionally computes the corresponding Nepali date.
     * Handles all the operations and variables while setting the English date.
     *
     * @param date The English date to set.
     * @param computeNepaliDate Flag indicating whether to compute the Nepali date. Default is `false`.
     * @returns void
     */
    private _setEnglishDate(date: Date, computeNepaliDate: boolean = false) {
        this.timestamp = date

        if (!computeNepaliDate)
            return

        const [yearNp, month0Np, dayNp] = dateConverter.englishToNepali(date.getFullYear(), date.getMonth(), date.getDate())
        this.year = yearNp
        this.month = month0Np
        this.day = dayNp
    }

    setEnglishDate(date: Date) {
        this._setEnglishDate(date, true)
    }

    getEnglishDate() {
        return this.timestamp
    }

    parse(dateString: string) {
        this.set.apply(this, parse(dateString))
    }

    getYear(): number {
        return this.year
    }

    getMonth(): number {
        return this.month
    }

    getDate(): number {
        return this.day
    }

    getDay(): number {
        return this.timestamp.getDay()
    }

    getHours(): number {
        return this.timestamp.getHours()
    }

    getMinutes(): number {
        return this.timestamp.getMinutes()
    }

    getSeconds(): number {
        return this.timestamp.getSeconds()
    }

    getMilliseconds(): number {
        return this.timestamp.getMilliseconds()
    }

    getTime(): number {
        return this.timestamp.getTime()
    }

    setYear(year: number) {
        this.set(year, this.month, this.day)
    }

    setMonth(month: number) {
        this.set(this.year, month, this.day)
    }

    setDate(day: number) {
        this.set(this.year, this.month, day)
    }

    set(year: number, month: number, date: number) {
        const [yearEn, month0EN, dayEn] = dateConverter.nepaliToEnglish(year, month, date)
        this.year = year
        this.month = month
        this.day = date
        this._setEnglishDate(new Date(yearEn, month0EN, dayEn))
    }

    format(formatStr: string) {
        return format(this, formatStr)
    }

    toString(): string {
        return `${this.year}/${this.month + 1}/${this.day}`
    }
}

NepaliDate.minimum = () => new Date(dateConverter.enMinYear(), 0, 1)
NepaliDate.maximum = () => new Date(dateConverter.enMaxYear(), 11, 31)

export default NepaliDate
