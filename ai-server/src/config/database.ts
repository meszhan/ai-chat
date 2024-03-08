import 'reflect-metadata';
import {DataSource} from 'typeorm';

import {User} from '../entity/User';
import {Message} from '../entity/Message';

export const database = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'CHAT',
    charset: 'utf8',
    synchronize: true,
    logging: false,
    entities: [User, Message],
    migrations: [],
    subscribers: []
});
