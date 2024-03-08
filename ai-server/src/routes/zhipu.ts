import express from 'express';
import {ZhipuAI as AiSdk} from 'zhipuai-sdk-nodejs-v4';
import {uuid} from 'uuidv4';
import {Between} from 'typeorm';

import {database} from '../config/database';
import {Message} from '../entity/Message';
import {FrontResponse} from '../model/response';
import {toJSON} from '../utils/text';

const router = express.Router();

/** 出于安全使用环境变量注入，用cross-env可以实现跨平台设置环境变量 */
const {ZHIPU_API_KEY} = process.env;
const ai = new AiSdk({apiKey: ZHIPU_API_KEY});

/**
 * 问答接口
 */
router.get('/zhipu/query', async (req, response) => {
    // 获取前端传的参数
    const params = req.query;
    response.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    });
    /** 先发送请求头 */
    response.flushHeaders();
    const data = await ai.createCompletions({
        model: 'GLM-4',
        messages: [{role: 'user', content: params['content'] as string}],
        /** 流式传输 */
        stream: true,
        /** 设置最大token数量 */
        maxTokens: +params.maxTokens
    });
    /** 完整消息内容 */
    let messageContent = '';
    /** 存储上一行内容 */
    let restLine = '';
    /** 监听大模型消息 */
    (data as any).on('data', (buffer: Uint8Array) => {
        /** 转字符串 */
        const content = buffer.toString();
        /** 去除空行 */
        const lines = content.split('\n').filter(line => line);
        lines.forEach(line => {
            try {
                /** 对话结束 */
                if (line === 'data: [DONE]') {
                    // 提交最后一行
                    if (restLine) {
                        messageContent += `${restLine}\n`;
                        response.write(`${restLine}\n\n`);
                        restLine = '';
                    }
                    const message = new Message();
                    message.messageId = uuid();
                    message.role = 'ai';
                    message.content = '';
                    const messageLines = messageContent
                        .split('\n')
                        .filter(line => line)
                        .map(line => toJSON<CompletionsResponseMessage>(line.slice(6)));
                    message.content = messageLines.reduce((prev, cur) => {
                        return prev + cur.choices.map(choice => choice.delta.content).join('');
                    }, '');
                    const usage = messageLines[messageLines.length - 1].usage;
                    message.promptTokens = usage.prompt_tokens;
                    message.completionTokens = usage.completion_tokens;
                    database.manager.save(message);
                    response.write(`\n\n${line}\n\n`);
                    response.end();
                    return;
                }
                if (line.startsWith('data: ') || restLine.endsWith('}}]}')) {
                    messageContent += `${restLine}\n\n`;
                    response.write(`${restLine}\n\n`);
                    restLine = line;
                } else {
                    restLine = restLine + line;
                }
            } catch (e) {
                console.log(e);
            }
        });
    });
});

router.get('/zhipu/messages', (_, response) => {
    try {
        database.manager.find(Message, {order: {createTime: 'ASC'}}).then(result => {
            response.json(new FrontResponse({result})).end();
        });
    } catch (e) {
        response
            .json(
                new FrontResponse({
                    global: {
                        message: e.message
                    }
                })
            )
            .end();
    }
});

router.post('/zhipu/messages', async (request, response) => {
    try {
        const message = new Message();
        message.messageId = uuid();
        message.role = request.body.role;
        message.content = request.body.content;
        await database.manager.save(message);
        response.json(new FrontResponse({result: message})).end();
    } catch (e) {
        response
            .json(
                new FrontResponse({
                    global: {
                        message: e.message
                    }
                })
            )
            .end();
    }
});

router.get('/zhipu/usage', async (_, response) => {
    try {
        const totalUsage = await database.manager.sum(Message, 'completionTokens');

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const todayUsage = await database.manager.sum(Message, 'completionTokens', {
            createTime: Between(startOfDay, endOfDay)
        });

        response
            .json(new FrontResponse({result: {total: 1000000, totalUsage: totalUsage + 30978 - 1457, todayUsage}}))
            .end();
    } catch (e) {
        response
            .json(
                new FrontResponse({
                    global: {
                        message: e.message
                    }
                })
            )
            .end();
    }
});

export {router};

type CompletionsResponseMessage = {
    id: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        finish_reason: string;
        message: {
            role: string;
            content: string;
            tool_calls: Array<{
                id: string;
                type: string;
                function: {
                    name: string;
                    arguments: object;
                };
            }>;
        };
        delta: {
            role: string;
            content: string;
            tool_calls: Array<{
                id: string;
                type: string;
                function: {
                    name: string;
                    arguments: object;
                };
            }>;
        };
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
