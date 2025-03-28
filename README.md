<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://github.com/excaliburhan/ultra-commit/blob/main/images/logo.png?raw=true">

<h1>Ultra Commit</h1>

基本能力完全 Fork 自 AI Commit。支持使用阿里云百炼、OPEN_AI、AI Studio 的 API 来根据暂存区的改动文件生成 Git Commit 信息

</div>

## ✨ Features

🤯 支持使用 阿里云百炼 / OpenAI / AI Studio API 根据 git diffs 自动生成提交信息
🗺️ 支持多语言提交信息
😜 支持添加 Gitmoji
🛠️ 支持自定义系统提示词
📝 支持 Conventional Commits 规范

## 📦 Installation

1. 在 VSCode 中搜索 "Ultra Commit" 并点击 "Install" 按钮。

> **Note**\
> 请确保 Node.js 版本 >= 16

## 🤯 Usage

1. 确保您已经安装并启用了 Ultra Commit 扩展。
2. 在 VSCode 设置中，找到 "ultra-commit" 配置项，并根据需要进行配置：
3. 在项目中进行更改并将更改添加到暂存区 (git add)。
4. (可选) 如果您想为提交消息提供额外的上下文，请在点击 AI Commit 按钮之前，在源代码管理面板的消息输入框中输入上下文。
5. 在 Source Control 面板的提交消息输入框旁边，单击 AI Commit 图标按钮。点击后，扩展将生成 Commit 信息（如果提供了额外上下文，将会考虑在内）并填充到输入框中。
6. 审核生成的 Commit 信息，如果满意，请提交更改。

> **Note**\
> 如果超过最大 token 长度请分批将代码添加到暂存区。

### ⚙️ 配置

> **Note** Version >= 0.0.5 不需要配置 `EMOJI_ENABLED` 和 `FULL_GITMOJI_SPEC`，默认提示词为 [prompt/without_gitmoji.md](./prompt/with_gitmoji.md)，如果不需要使用 `Gitmoji`，请将 `SYSTEM_PROMPT` 设置为您的自定义提示词, 请参考 [prompt/without_gitmoji.md](./prompt/without_gitmoji.md)。

在 `VSCode` 设置中，找到 "ultra-commit" 配置项，并根据需要进行配置

| 配置                |  类型  |   默认   | 必要 |                                                 备注                                                  |
| :------------------ | :----: | :------: | :--: | :---------------------------------------------------------------------------------------------------: |
| AI_PROVIDER         | string | bailian  | Yes  |                              Select AI Provider: `bailian` or `openai`.                               |
| BAILIAN_API_KEY     | string |   None   | Yes  | 将`AI Provider`设置为`bailian`时需要。[Bailian API key](https://bailian.console.aliyun.com/?apiKey=1) |
| BAILIAN_MODEL       | string | qwen-max | Yes  |                                 支持 qwen-max、qwen-plus、qwen-turbo                                  |
| BAILIAN_TEMPERATURE | number |   0.7    |  No  |   `Bailian` 阿里云百炼温度参数，控制输出的随机性。范围：0-1。较低的值：更加集中，较高的值：更有创造   |
| BAILIAN_TOP_P       | number |   0.8    |  否  |                     `Bailian` 阿里云百炼核采样参数，控制输出的多样性。范围：0-1。                     |
| OPENAI_API_KEY      | string |   None   |  是  |                      [OpenAI 令牌](https://platform.openai.com/account/api-keys)                      |
| OPENAI_BASE_URL     | string |   None   |  否  |          如果是 Azure，使用：https://{resource}.openai.azure.com/openai/deployments/{model}           |
| OPENAI_MODEL        | string |  gpt-4o  |  是  |        OpenAI MODEL, 你可以通过运行 `Show Available OpenAI Models` 命令从列表中选择一个模型。         |
| OPENAI_TEMPERATURE  | number |   0.7    |  否  |                 控制输出的随机性。范围：0-2。较低的值：更加集中，较高的值：更有创造性                 |
| AI_COMMIT_LANGUAGE  | string |    en    |  是  |                                            支持 19 种语言                                             |
| SYSTEM_PROMPT       | string |   None   |  否  |                                           自定义系统提示词                                            |
