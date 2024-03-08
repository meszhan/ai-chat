import {create} from 'zustand';

export interface MessageType {
    /** 消息id */
    messageId: string;
    /** 角色 */
    role: 'user' | 'ai';
    /** 内容 */
    content: string;
    /** 状态 */
    state: 'pending' | 'end';
}

interface MessageStoreType {
    messageList: MessageType[];
    /** 获取消息列表 */
    getMessageList(): Promise<MessageType[]>;
    /** 添加消息 */
    pushMessage: (data: MessageType | MessageType[]) => void;
    /** 追加消息内容 */
    appendMessageContent: (content: string) => void;
    /** 结束回答 */
    endMessage: () => void;
}

export const useMessageStore = create<MessageStoreType>(set => ({
    messageList: [],
    getMessageList: async () => {
        
    },
    pushMessage: (data: MessageType | MessageType[]) => {
        set(state => ({messageList: state.messageList.concat(Array.isArray(data) ? data : [data])}));
    },
    appendMessageContent: (content: string) => {
        set(state => {
            const last = state.messageList[state.messageList.length - 1];
            return {
                messageList: [
                    ...state.messageList.slice(0, state.messageList.length - 1),
                    {...last, content: last.content + content}
                ]
            };
        });
    },
    endMessage: () => {
        set(state => {
            const last = state.messageList[state.messageList.length - 1];
            return {
                messageList: [...state.messageList.slice(0, state.messageList.length - 1), {...last, state: 'end'}]
            };
        });
    }
}));
