async function tts(text, _lang, options = {}) {
    const { config, utils } = options;
    const { http } = utils;
    const { fetch, Body } = http;

    let { appId, token, voiceType, emotion, emotionScale, speedRatio } = config;

    console.log('收到的配置:', config);

    if (!token) {
        throw "需要Access Token";
    }

    const requestBody = {
        app: {
            appid: appId || "default_appid",
            token: token,
            cluster: "volcano_tts"
        },
        user: {
            uid: "pot-app-user"
        },
        audio: {
            voice_type: voiceType || "zh_male_M392_conversation_wvae_bigtts",
            encoding: "mp3",
            speed_ratio: parseFloat(speedRatio || "1.0")
        },
        request: {
            reqid: Math.random().toString(36).substring(7),
            text: text,
            operation: "query"
        }
    };

    console.log('请求地址:', "https://openspeech.bytedance.com/api/v1/tts");
    console.log('请求体:', JSON.stringify(requestBody, null, 2));

    try {
        const res = await fetch("https://openspeech.bytedance.com/api/v1/tts", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer;${token}`
            },
            body: Body.json(requestBody),
            responseType: 3
        });
        console.log('响应状态:', res.status);
        console.log('响应头:', res.headers);

        let result;
        if (Array.isArray(res.data)) {
            const textDecoder = new TextDecoder();
            const jsonStr = textDecoder.decode(new Uint8Array(res.data));
            console.log('解码后的响应数据:', jsonStr);
            try {
                result = JSON.parse(jsonStr);
            } catch (e) {
                console.error('JSON解析错误:', e);
                throw new Error('响应数据解析失败');
            }
        } else {
            result = res.data;
        }

        console.log('处理后的响应数据:', result);

        if (!result) {
            throw new Error('响应为空');
        }

        if (result.code !== 3000) {
            throw new Error(`API错误: ${result.message || '未知错误'} (错误码: ${result.code})`);
        }        if (!result.data) {
            throw new Error('响应中缺少音频数据');
        }
        const binaryStr = atob(result.data);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        return bytes;
    } catch (error) {
        console.error('错误详情:', error);
        throw `语音合成失败: ${error.message || error}`;
    }
}