/**
 * @file 消息
 */

import {useEffect, useRef} from 'react';
import {Avatar, Spin, message as AntdMessage} from 'antd';
import markdownit from 'markdown-it';
import {escapeHtml} from 'markdown-it/lib/common/utils';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import copy from 'copy-to-clipboard';

import {MessageType} from '../../../../stores/message';
import {insertCursor, removeElement} from '../../../../utils';

import reactLogo from '../../../../assets/react.svg';
import viteLogo from '/vite.svg';

import cls from './index.module.scss';

const highlightCode = (str: string, lang: string) => {
    /** 添加语言 */
    if (lang && hljs.getLanguage(lang)) {
        try {
            return `<div class="hl-code"><div class="hljs"><code>${
                hljs.highlight(str, {language: lang, ignoreIllegals: true}).value
            }</code></div>
            <button class="markdown-it-code-copy-btn" type="button" data-clipboard-text="${str}">
        <svg viewBox="64 64 896 896" data-icon="copy" width="1em" height="1em" fill="currentColor">
          <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
        </svg>
    </button>
    </div>`;
        } catch (__) {
            console.log(__, 'error');
        }
        return '';
    }
    return `<div class="hl-code"><div class="hljs"><code>${escapeHtml(str)}</code></div></div>`;
};

export default function MessageItem({message}: {message: MessageType}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const md = markdownit({
        highlight: highlightCode
    });

    useEffect(() => {
        const target = contentRef.current;
        /** 回答结束后移除光标 */
        if (!target || message.state === 'end') {
            removeElement(document.querySelector('#input-cursor'));
        } else {
            insertCursor(target, '<span id="input-cursor" class="input-cursor"></span>');
        }
    }, [message.content, message.state]);

    useEffect(() => {
        document.querySelectorAll('.markdown-it-code-copy-btn').forEach(target => {
            target.onclick = e => {
                console.log(e.currentTarget.attributes);
                if (copy(e.currentTarget?.attributes['data-clipboard-text'].value)) {
                    void AntdMessage.success('复制成功');
                } else {
                    void AntdMessage.error('复制失败');
                }
            };
        });
    }, []);

    return (
        <div className={cls.messageItem}>
            {message.role === 'ai' ? (
                <Avatar className={cls.avatar} style={{margin: '0 12px'}} src={reactLogo} size={32} />
            ) : (
                <Avatar className={cls.avatar} style={{margin: '0 12px'}} src={viteLogo} size={32} />
            )}
            <div className={cls.messageContent}>
                <div ref={contentRef} dangerouslySetInnerHTML={{__html: md.render(message.content)}}></div>
            </div>
        </div>
    );
}
