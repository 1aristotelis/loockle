export function getDaysByBlocks(amount: number):number{
    const days = Math.ceil(amount / 144)
    return days
}