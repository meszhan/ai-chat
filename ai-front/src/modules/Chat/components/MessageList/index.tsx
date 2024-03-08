/**
 * @file 消息列表
 */

import {useEffect, useRef} from 'react';

import MessageItem from '../MessageItem';
import {useMessageStore} from '../../../../stores/message';
import {scrollToBottom} from '../../../../utils';

import cls from './index.module.scss';

export default function MessageList() {
    const messageListRef = useRef<HTMLDivElement | null>(null);
    const {messageList} = useMessageStore();

    useEffect(() => {
        scrollToBottom(messageListRef.current);
    }, [messageList]);

    return (
        <div ref={messageListRef} id="message-list" className={cls.messageList}>
            {messageList.map((message, index) => (
                <MessageItem key={index} message={message} />
            ))}
        </div>
    );
}
