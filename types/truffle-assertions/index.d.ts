declare module "truffle-assertions" {
        export const ErrorType: {
        INVALID_JUMP: string;
        INVALID_OPCODE: string;
        OUT_OF_GAS: string;
        REVERT: string;
    };
    export function createTransactionResult(contract: any, transactionHash: any): any;
    export function eventEmitted(result: any, eventType: any, filter: any, message: any): void;
    export function eventNotEmitted(result: any, eventType: any, filter: any, message: any): void;
    export function fails(asyncFn: any, errorType: any, reason?: any, message?: any): any;
    export function prettyPrintEmittedEvents(result: any): void;
    export function reverts(asyncFn: any, reason: any, message: any): any;
}