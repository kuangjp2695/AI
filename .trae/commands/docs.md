# /docs - API 文档生成命令

根据路由和 Controller 代码生成 API 文档。

## 使用方式

```
/docs [--md|--openapi]
```

## 功能说明

调用 API 文档生成技能，自动生成 API 文档：
- 分析路由定义和 Controller 代码
- 提取请求参数和响应格式
- 生成结构化的 API 文档
- 支持 Markdown 和 OpenAPI 格式

## 参数

- `--md`：生成 Markdown 格式文档（默认）
- `--openapi`：生成 OpenAPI 3.0 规范 JSON

## 示例

```
/docs
/docs --openapi
```

## 输出

在 `docs/api/` 目录下生成 API 文档文件。
