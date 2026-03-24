# AI Chat Vue

一个基于 Vue 3 + TypeScript 构建的现代 AI 聊天应用，支持 OpenAI API 格式的对话服务。

![Vue 3](https://img.shields.io/badge/Vue%203-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

## ✨ 功能特性

### 💬 核心聊天功能
- **多对话管理** - 支持创建、切换、删除多个对话会话
- **流式响应** - 实时显示 AI 回复，支持打字机效果
- **Markdown 渲染** - 完整支持 Markdown 语法，包括代码块、列表、表格等
- **语法高亮** - 代码块支持多种编程语言的语法高亮
- **重新生成** - 支持重新生成 AI 回复
- **自动滚动** - 新消息自动滚动到底部

### ⚙️ 设置选项
- **API 配置** - 自定义 API Base URL、API Key 和默认模型
- **生成参数** - 调节 Temperature 和 Max Tokens
- **外观设置** - 浅色/深色主题、字体大小调整
- **数据管理** - 清除所有对话历史

### 📱 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **侧边栏** - 可折叠的对话列表侧边栏
- **快捷键** - Enter 发送，Shift+Enter 换行
- **消息复制** - 一键复制代码块内容

## 🛠️ 技术栈

- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios
- **图标**: Lucide Vue
- **Markdown 渲染**: Marked + Highlight.js

## 📦 项目结构

```
ai-chat-vue/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── chat.ts        # 聊天 API
│   │   ├── http.ts        # HTTP 客户端配置
│   │   └── stream.ts      # 流式请求处理
│   ├── assets/            # 资源文件
│   │   └── styles/        # 全局样式
│   ├── components/        # Vue 组件
│   │   ├── chat/          # 聊天相关组件
│   │   ├── common/        # 通用组件
│   │   └── layout/        # 布局组件
│   ├── composables/       # 组合式函数
│   │   ├── useChat.ts     # 聊天逻辑封装
│   │   ├── useScroll.ts   # 滚动控制
│   │   └── useStorage.ts  # 本地存储
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   │   ├── chat.ts        # 对话状态
│   │   ├── settings.ts    # 设置状态
│   │   └── user.ts        # 用户状态
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   ├── ChatView.vue   # 聊天页面
│   │   └── SettingsView.vue # 设置页面
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
├── .env.example           # 环境变量示例
├── index.html             # HTML 入口
├── package.json           # 依赖配置
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 为 `.env` 并配置你的 API 信息：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000      # API 服务器地址
VITE_API_KEY=your-api-key-here               # 你的 API Key
VITE_DEFAULT_MODEL=gpt-3.5-turbo             # 默认模型
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## ⚙️ 配置说明

### API 兼容性

本项目支持所有兼容 OpenAI API 格式的服务，包括：

- OpenAI API
- Azure OpenAI
- 第三方代理服务（如 api2d、o.airena.cc 等）
- 自托管模型（如 LocalAI、FastChat 等）

### 支持的模型

- GPT-3.5 Turbo
- GPT-4
- GPT-4 Turbo
- Claude 3 Sonnet
- Claude 3 Opus
- 其他兼容 OpenAI API 的模型

## 📝 开发指南

### 代码规范

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format

# TypeScript 类型检查
npm run type-check
```

### 添加新功能

1. **添加 API 接口**: 在 `src/api/` 目录下创建新的 API 文件
2. **添加组件**: 在 `src/components/` 目录下创建 Vue 组件
3. **添加状态**: 在 `src/stores/` 目录下使用 Pinia 定义状态
4. **添加类型**: 在 `src/types/` 目录下定义 TypeScript 类型

## 🔧 常见问题

### Q: 如何配置代理？

A: 在 `vite.config.ts` 中配置代理：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-api-server',
      changeOrigin: true,
    }
  }
}
```

### Q: 如何添加新的模型？

A: 编辑 `src/views/SettingsView.vue` 中的模型选项列表：

```vue
<select v-model="settings.defaultModel">
  <option value="your-new-model">Your New Model</option>
  <!-- ... -->
</select>
```

### Q: 如何持久化对话数据？

A: 当前版本数据存储在内存中。如需持久化，可修改 `src/composables/useStorage.ts` 使用 localStorage：

```typescript
import { useLocalStorage } from '@vueuse/core'

export const conversations = useLocalStorage('chat-conversations', [])
```

## 📄 许可证

[MIT](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系

如有问题或建议，欢迎通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件至 [your-email@example.com]

---

Made with ❤️ using Vue 3 + TypeScript
