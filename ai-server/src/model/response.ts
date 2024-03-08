/**
 * @file 响应格式
 */

export interface FrontResponseSnapshot<T> {
    /** 响应码 */
    code: number;
    /** 日志id */
    logId: string;
    /** 是否成功 */
    success: boolean;
    /** traceId */
    traceId: string;
    /** 响应结果 */
    result?: Array<T> | T;
    /** 错误信息 */
    global?: {
        message: string;
    };
}

export class FrontResponse<T> {
    /** 响应码 */
    code: number = 0;
    /** 日志id */
    logId: string = '';
    /** 是否成功 */
    success: boolean = true;
    /** traceId */
    traceId: string = '';
    /** 响应结果 */
    result?: Array<T> | T;
    /** 错误信息 */
    global?: {
        message: string;
    };

    constructor(d: Partial<FrontResponseSnapshot<T>>) {
        Object.assign(this, d);
    }
}
