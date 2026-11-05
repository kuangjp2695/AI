# /refactor - 代码重构命令

对指定代码进行重构优化。

## 使用方式

```
/refactor [文件路径] [--extract-function|--simplify|--cleanup]
```

## 功能说明

调用重构辅助技能，对代码进行重构优化：
- 提取函数/变量
- 简化复杂逻辑
- 减少嵌套
- 消除重复代码
- 改进命名

## 参数

- `文件路径`：需要重构的文件
- `--extract-function`：提取函数（长函数拆分）
- `--simplify`：简化复杂条件和逻辑
- `--cleanup`：全面清理和优化

## 示例

```
/refactor src/services/task.service.ts
/refactor src/utils/helpers.ts --extract-function
```

## 输出

重构后的代码和重构说明报告。
