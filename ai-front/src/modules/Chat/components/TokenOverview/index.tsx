/**
 * @file Token用量统计
 */

import {Progress} from 'antd';
import {useEffect, useState} from 'react';

import cls from './index.module.scss';
import {useMessageStore} from '../../../../stores/message';

interface UsageType {
    /** 总量使用 */
    totalUsage: number;
    /** 今日已使用 */
    todayUsage: number;
    /** 总共额度 */
    total: number;
}

const TokenOverview = () => {
    const {messageList} = useMessageStore();
    const [usage, setUsage] = useState<UsageType>({
        totalUsage: 0,
        todayUsage: 0,
        total: 0
    });

    useEffect(() => {
        fetch('http://localhost:3000/zhipu/usage')
            .then(res => res.json())
            .then(res => {
                setUsage(res.result);
            });
    }, [messageList]);

    return (
        <div className={cls.overviewContainer}>
            <h3>总使用量</h3>
            <Progress
                type="circle"
                percent={usage.total === 0 ? 0 : usage.totalUsage / usage.total}
                style={{fontSize: 12}}
                format={() => (
                    <div
                        style={{fontSize: 12}}
                        className={cls.percentFormat}
                    >{`${usage.totalUsage}/${usage.total}`}</div>
                )}
            />
            <h3>今日使用量</h3>
            <Progress
                type="circle"
                percent={usage.total === 0 ? 0 : usage.todayUsage / usage.total}
                style={{fontSize: 12}}
                format={() => (
                    <div
                        style={{fontSize: 12}}
                        className={cls.percentFormat}
                    >{`${usage.todayUsage}/${usage.total}`}</div>
                )}
            />
        </div>
    );
};

export default TokenOverview;
