## 12. Skill_RulePriorityLogic：规则优先级与例外系统生成 Skill

该 Skill 用于生成通用规则、特殊规则、例外条款、GM裁定、自制规则、世界观特例之间的优先级逻辑。

### input

input 可以包括：

规则书总则；
特殊能力文本；
可选规则；
世界观例外；
GM 裁定；
自制规则；
补丁说明；
版本差异；
FAQ；
战役记录。

### 处理目标

该 Skill 需要将不同作品中的“规则冲突处理方式”统一抽象为 RulePriorityLogic。

需要兼容的近似术语包括：

通用规则；
特殊规则；
例外；
覆盖；
优先级；
裁定；
桌规；
自制规则；
可选规则；
版本规则；
世界观特例；
能力特例；
免疫特例；
禁止；
允许；
替代规则。

### output

输出为该作品的 RulePriorityLogic，至少包括：

通用规则；
特殊规则；
例外来源；
覆盖关系；
冲突检测；
优先级排序；
适用范围；
生效条件；
失效条件；
是否需要 GM 裁定；
裁定是否长期有效；
裁定是否写回规则图谱；
裁定是否覆盖已有规则。

### logic 抽象格式

```yaml
RulePriorityLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 通用规则
    - 特殊规则
    - 例外
    - 裁定
    - 覆盖
    - 优先级
  general_rule: 通用规则节点
  special_rule: 特殊规则节点
  exception_rule: 例外规则节点
  source_priority: 官方规则、wiki、FAQ、版本补丁、GM裁定、自制模组或战役记录的优先级
  conflict_detection: 判断多个规则是否同时作用于同一对象、同一时机、同一结果
  override_rule: 特殊覆盖一般、后写入覆盖前写入、GM裁定覆盖默认规则或按来源优先级处理
  scope: 全局、战役、场景、角色、能力、装备、地点或一次性判定
  state_writeback: 写入裁定记录、规则覆盖关系、启用状态或禁用状态
```

该 Skill 的作用是保证 GraphRAG 在面对复杂作品、跨版本资料、自制设定和临时裁定时，不会机械套用互相冲突的规则，而是能够按照优先级生成稳定的系统 logic。
