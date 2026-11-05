# /test - 生成测试命令

为指定的源文件生成单元测试或集成测试。

## 使用方式

```
/test [文件路径] [--unit|--integration]
```

## 功能说明

调用测试生成技能，为指定文件生成测试代码：
- 分析被测代码的逻辑和分支
- 设计全面的测试用例（正常/边界/异常）
- 生成符合项目规范的测试代码
- 使用 Jest + ts-jest

## 参数

- `文件路径`：需要生成测试的源文件路径
- `--unit`：生成单元测试（默认）
- `--integration`：生成集成测试

## 示例

```
/test src/services/task.service.ts
/test src/controllers/task.controller.ts --integration
```

## 输出

生成完整的测试文件，放在 `tests/` 目录对应位置。
