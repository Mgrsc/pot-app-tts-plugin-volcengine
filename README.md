# Pot-App 火山引擎 TTS 插件

本插件使得 Pot App 可以通过火山引擎的语音合成（TTS）服务将文本转换为语音。

## 功能

*   调用火山引擎大模型语音合成 API。
*   支持多种配置选项，包括 AppID、Access Token、音色、情感、语速等。

## 安装与配置

1.  **获取凭证**:
    *   您需要从火山引擎控制台获取 `AppID` 和 `Access Token`。详细信息请参考：[火山引擎控制台使用FAQ-Q1](https://www.volcengine.com/docs/6561/196768#q1%EF%BC%9A%E5%93%AA%E9%87%8C%E5%8F%AF%E4%BB%A5%E8%8E%B7%E5%8F%96%E5%88%B0%E4%BB%A5%E4%B8%8B%E5%8F%82%E6%95%B0appid%EF%BC%8Ccluster%EF%BC%8Ctoken%EF%BC%8Cauthorization-type%EF%BC%8Csecret-key-%EF%BC%9F)

2.  **在 Pot App 中配置插件**:
    打开 Pot App 的插件设置，找到“火山引擎 TTS”插件，并填写以下信息：

    *   **AppID**: (必填) 您从火山引擎获取的 AppID。
    *   **Access Token**: (必填) 您从火山引擎获取的 Access Token。
    *   **音色类型 (Voice Type)**: (可选) 默认为 `zh_male_M392_conversation_wvae_bigtts`。您可以根据火山引擎文档选择其他音色。
    *   **音色情感 (Emotion)**: (可选) 选择音色所表达的情感。
        *   无 (none)
        *   生气 (angry)
        *   开心 (happy)
        *   悲伤 (sad)
    *   **情绪强度 (Emotion Scale)**: (可选) 设置情感的强度，范围 1.0 到 5.0。
    *   **语速 (Speed Ratio)**: (可选) 调整语音播放的速度，范围 0.8 到 2.0。

## 使用方法

在 Pot App 中选择需要转换为语音的文本，然后选择“火山引擎 TTS”作为语音合成服务即可。

## 参数说明

插件通过调用火山引擎的 HTTP API (`https://openspeech.bytedance.com/api/v1/tts`) 进行语音合成。以下是主要的请求参数说明，这些参数会根据您在 Pot App 中的配置进行填充：

### `app` (应用信息)
*   `appid`: 您的应用标识 (AppID)。
*   `token`: 您的访问令牌 (Access Token)。
*   `cluster`: 固定为 `volcano_tts`。

### `user` (用户信息)
*   `uid`: 用户标识，插件中固定为 `pot-app-user`。

### `audio` (音频参数)
*   `voice_type`: 音色类型。例如 `zh_male_M392_conversation_wvae_bigtts`。
*   `encoding`: 音频编码格式，插件中固定为 `mp3`。
*   `speed_ratio`: 语速。例如 `1.0`。
*   (如果配置了情感) `emotion`: 音色情感。例如 `happy`。
*   (如果配置了情感强度) `emotion_scale`: 情绪强度。例如 `4.0`。

### `request` (请求参数)
*   `reqid`: 请求的唯一ID，由插件自动生成。
*   `text`: 需要转换的文本内容。
*   `operation`: 操作类型，插件中固定为 `query` (非流式，一次性返回)。

### 认证方式
请求头中包含 `Authorization: Bearer;{token}` 进行身份认证。

## 示例请求体 (由插件自动构建)

```json
{
    "app": {
        "appid": "YOUR_APP_ID",
        "token": "YOUR_ACCESS_TOKEN",
        "cluster": "volcano_tts"
    },
    "user": {
        "uid": "pot-app-user"
    },
    "audio": {
        "voice_type": "zh_male_M392_conversation_wvae_bigtts",
        "encoding": "mp3",
        "speed_ratio": 1.0
    },
    "request": {
        "reqid": "generated_uuid",
        "text": "您好，欢迎使用火山引擎语音合成服务。",
        "operation": "query"
    }
}
```

## 注意事项

*   请确保您的火山引擎账户有足够的配额和权限来使用所选的音色。
*   `Access Token` 通常具有时效性，请注意及时更新。
*   详细的 API 参数、错误码和音色列表，请参考[火山引擎官方文档](https://www.volcengine.com/docs/6561/1257584)。

