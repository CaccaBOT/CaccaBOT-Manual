/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv'
dotenv.config()

console.log('Hello World!')
console.log(sum(1, 2))

export function sum(a: number, b: number): number {
    return a + b
}
