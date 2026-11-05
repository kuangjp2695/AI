# /test/run - 运行测试

运行项目的测试套件。

## 使用方式

```
/test/run [--unit|--integration|--coverage|--watch]
```

## 功能说明

运行 Jest 测试，支持多种模式：
- 运行全部测试
- 只运行单元测试
- 只运行集成测试
- 生成覆盖率报告
- 监听模式（文件变化自动重跑）

## 参数

- 无参数：运行全部测试
- `--unit`：只运行单元测试
- `--integration`：只运行集成测试
- `--coverage`：生成覆盖率报告
- `--watch`：监听模式

## 示例

```
/test/run
/test/run --unit
/test/run --coverage
/test/run --watch
```

## 执行命令

```bash
# 全部测试
npm test

# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 覆盖率
npm test -- --coverage

# 监听模式
npm run test:watch
```
