# 内容实体层：陷阱与机关系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【陷阱与机关系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "内容实体层"
  target_system: "陷阱与机关系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "陷阱与机关系统"
    source_terms: []
    normalized_terms: []
    core_objects: []
    attributes: []
    constraints: []
    dependencies: []
    state_changes: []
    graph_nodes: []
    graph_edges: []
    execution_notes: []
```

## 4. 术语兼容规则

当传入内容来自不同 ACGN 作品时，系统应优先识别语义功能，而不是强制要求术语完全一致。

可映射到本系统的常见近似术语包括：陷阱、机关、谜题机关、封印、警报、机关门、毒针、落石、传送陷阱、安全系统。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【陷阱与机关系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 陷阱名称
- 陷阱类型
- 发现难度
- 解除难度
- 触发条件
- 伤害
- 状态
- 重置
- 绕过方式

## 6. 核心属性字段

- trap_id
- trap_name
- trap_type
- detection_rule
- disarm_rule
- trigger_condition
- effect
- damage
- status_effects
- reset_rule
- bypass_methods
- location

## 7. 依赖关系

- 探索与旅行系统
- 基础检定系统
- 道具与消耗品系统
- 环境实体系统
- 场景系统

## 8. 处理流程

1. 识别作品中的陷阱、机关、封印、警报、谜题或安全系统。
2. 抽取发现方式、解除方式、触发条件、伤害和失败后果。
3. 判断其是否可绕过、拆除、反利用或重复触发。
4. 建立陷阱与地点、场景、工具、检定和伤害系统的连接。
5. 输出 trap_entity logic，用于探索与地牢运行。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "陷阱与机关系统"
  - type: "SourceTerm"
    name: "原作品术语"
  - type: "NormalizedTerm"
    name: "标准化术语"
  - type: "LogicObject"
    name: "系统内对象"
  - type: "Constraint"
    name: "限制条件"
  - type: "StateChange"
    name: "状态变化"
  - type: "SourceText"
    name: "来源文本"
```

## 10. GraphRAG 边建议

- TrapEntity LOCATED_AT Location
- TrapEntity TRIGGERED_BY Condition
- TrapEntity REQUIRES Check
- TrapEntity DEALS Damage
- TrapEntity CAN_BE_DISARMED_BY Tool

## 11. 输出 Logic 模板

```yaml
陷阱与机关系统_logic:
  canonical_system: "陷阱与机关系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "陷阱与机关系统"
      reason: ""
  core_objects:
    - object_id: ""
      object_name: ""
      object_type: ""
      source_term: ""
      normalized_term: ""
  attributes:
    - key: ""
      value: ""
      source: ""
  constraints:
    - condition: ""
      effect: ""
      priority: "general | special | exception"
  dependencies:
    - depends_on_system: ""
      relation: ""
  state_changes:
    - trigger: ""
      before: ""
      after: ""
  graph_nodes:
    - node_id: ""
      node_type: ""
      label: ""
  graph_edges:
    - from: ""
      relation: ""
      to: ""
  execution_notes:
    - ""
```

## 12. 自检要求

生成 logic 前应检查：

1. 是否保留了原作品术语。
2. 是否建立了标准化术语映射。
3. 是否区分了静态设定、动态状态与规则逻辑。
4. 是否声明了跨系统依赖。
5. 是否避免把纯叙事描述误判为硬规则。
6. 是否能够被 GraphRAG 作为节点与边继续调用。
