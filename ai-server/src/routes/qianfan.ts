/** 千帆应用API_KEY */
const QIANFAN_API_KEY = 'CwCqXSIvPxoSWqSDaqZFKinc';
/** 千帆应用SECRET_KEY */
const QIANFAN_SECRET_KEY = 'ubsiiYBFqGlmOvxbLoAn2jPZqNLMytWj';

/**
 * @function 获取千帆接口AccessToken
 */
const getToken = async () => {
    try {
        const res = await fetch(
            `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${QIANFAN_API_KEY}&client_secret=${QIANFAN_SECRET_KEY}`
        );
        const {access_token} = await res.json();
        return access_token;
    } catch (e) {
        console.log('获取AccessToken失败：', e);
    }
    return '';
};

module.exports = {getToken};

// data.choices.forEach(choice => {
//     console.log(choice.message);
//     response.write(`data: ${choice.message.content}\n\n`);
// });
// response.write('data: DONE\n\n');
// response.end();
// fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
//     headers: {
//         Authorization:
//             'eyJhbGciOiJIUzI1NiIsInNpZ25fdHlwZSI6IlNJR04ifQ.eyJhcGlfa2V5IjoiOWYwMTAxNjljYTA2NDEwYWQxNzUzYzQ3OTAwYmIxYWQiLCJleHAiOjE3MDk2NDA3MDE1ODMsInRpbWVzdGFtcCI6MTcwOTYzNzEwMTU4M30.Esk7nDTgYGBPIH4Mx3yPtbpYgnJ-RNLt07NEg4HgWX8',
//         'Content-Type': 'application/json'
//     },
//     method: 'POST',
//     body: {model: 'GLM-4', messages: [{role: 'user', content: params.content}], stream: true}
// })
//     .then(res => res.body.getReader())
//     .then(reader => {
//         reader.read().then(content => {
//             console.log(JSON.parse(String.fromCharCode.apply(null, content.value)));
//             console.log(decoder.decode(content.value, {stream: !content.done}));
//         });
//     })
//     .catch(e => {
//         console.log(e);
//     });
// fetch(
//     `https://open.bigmodel.cn/api/paas/v4/chat/completions&client_id=${QIANFAN_API_KEY}&client_secret=${QIANFAN_SECRET_KEY}`
// )
//     .then(res => res.json())
//     .then(res => {
//         qianfan_access_token = res.access_token;
//         console.log(qianfan_access_token);
//     })
//     .then(() => {
//         fetch(
//             `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${qianfan_access_token}`,
//             {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     messages: [{role: 'user', content: params.content}],
//                     stream: true,
//                     max_output_tokens: 8
//                 })
//             }
//         )
//             .then(res => {
//                 return res.body.getReader();
//             })
//             .then(reader => {
//                 let buffer = '';
//                 let messageBuffer = '';
//                 // buffer += decoder.decode(content.value, {stream: !content.done});
//                 reader.read().then(content => {
//                     console.log(decoder.decode(content.value, {stream: !content.done}));
//                 });
//                 // processMessage(reader, msg => {
//                 //     console.log(msg);
//                 //     if (msg.type == 'DATA') {
//                 //         response.write('data: ' + msg.content.result);
//                 //     } else if (msg.type == 'END') {
//                 //         response.write('data: DONE');
//                 //         response.end();
//                 //     } else {
//                 //         console.log(msg);
//                 //     }
//                 // });
//             })
//             .catch(e => {
//                 console.log(e);
//                 response.end();
//             });
//     })
//     .catch(e => {
//         console.log('获取AccessToken失败：', e);
//     });
