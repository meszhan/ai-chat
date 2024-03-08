import {Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Message {
    @PrimaryColumn()
    messageId: string;

    @Column()
    role: 'ai' | 'user' = 'ai';

    @Column('text')
    content: string = '';

    @Column()
    promptTokens: number = 0;

    @Column()
    completionTokens: number = 0;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
