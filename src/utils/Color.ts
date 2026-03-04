export function GetColor(freq: number, i: number): string {
    const red = Math.floor(Math.sin(freq * i + 0) * 127 + 128)
    const green = Math.floor(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128)
    const blue = Math.floor(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128)
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`
}
export function GetColorWithOpacity(freq: number, i: number, opacity: number): string {
    const red = Math.floor(Math.sin(freq * i + 0) * 127 + 128)
    const green = Math.floor(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128)
    const blue = Math.floor(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128)
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}