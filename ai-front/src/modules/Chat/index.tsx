/**
 * @file 对话页面
 */
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Input} from 'antd';
import {nanoid} from 'nanoid';

import MessageList from './components/MessageList';
import {useMessageStore} from '../../stores/message';
import {scrollToBottom} from '../../utils';

import cls from './index.module.scss';
import TokenOverview from './components/TokenOverview';

export default function AiChat() {
    const [promptValue, setPromptValue] = useState('');
    const {messageList, pushMessage, endMessage, appendMessageContent} = useMessageStore();

    useEffect(() => {
        const list = document.querySelector('#message-list');
        scrollToBottom(list!);
    }, [messageList]);

    useEffect(() => {
        fetch('http://localhost:3000/zhipu/messages')
            .then(res => res.json())
            .then(res => {
                pushMessage(res.result.map((message: any) => ({...message, state: 'end'})));
            });
    }, [pushMessage]);

    const onGenerateAnswer = useCallback(() => {
        if (!promptValue) {
            return;
        }
        pushMessage({messageId: nanoid(), role: 'user', content: promptValue, state: 'end'});
        fetch('http://localhost:3000/zhipu/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({role: 'user', content: promptValue})
        });
        pushMessage({messageId: nanoid(), role: 'ai', content: '', state: 'pending'});
        setPromptValue('');
        const evtSource = new EventSource(`http://localhost:3000/zhipu/query?content=${promptValue}`);
        try {
            evtSource.onmessage = event => {
                //  流式数据最后一条的状态为[DONE]代表结束返回
                if (event.data === '[DONE]') {
                    endMessage();
                    evtSource.close();
                } else {
                    try {
                        const messages = JSON.parse(event.data).choices;
                        messages.map((message: {delta: {content: string}}) => {
                            appendMessageContent(message.delta.content);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
            };
            evtSource.onerror = () => {
                evtSource.close();
            };
        } catch (e) {
            console.log(e);
            evtSource.close();
        }
    }, [appendMessageContent, endMessage, promptValue, pushMessage]);

    const promptDisabled = useMemo(
        () => messageList.length > 0 && messageList[messageList.length - 1].state === 'pending',
        [messageList]
    );

    return (
        <div className={cls.chatContainer}>
            <TokenOverview />
            <div className={cls.chatContent}>
                <div className={cls.chatList}>
                    <MessageList />
                </div>
                <div className={cls.chatInput}>
                    <Input
                        value={promptValue}
                        disabled={promptDisabled}
                        placeholder="Send a message（Cmd+Enter换行，Enter发送）"
                        onChange={e => {
                            setPromptValue(e.target.value);
                        }}
                        onPressEnter={onGenerateAnswer}
                    />
                </div>
            </div>
        </div>
    );
}
