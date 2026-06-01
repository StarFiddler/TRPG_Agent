# 内容实体层：环境实体系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【环境实体系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "内容实体层"
  target_system: "环境实体系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "环境实体系统"
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

可映射到本系统的常见近似术语包括：环境、地形、天气、光照、区域效果、场地效果、污染、异常空间、水域、高温、毒雾、掩体。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【环境实体系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 环境名称
- 环境类型
- 作用范围
- 触发条件
- 影响检定
- 影响移动
- 伤害
- 状态
- 解除方式

## 6. 核心属性字段

- environment_id
- environment_name
- environment_type
- area
- trigger
- check_modifiers
- movement_modifiers
- attack_modifiers
- damage
- status_effects
- removal_condition

## 7. 依赖关系

- 探索与旅行系统
- 攻击与防御系统
- 状态系统
- 伤害与治疗系统
- 地图与地点系统
- 场景系统

## 8. 处理流程

1. 读取作品中的地形、天气、光照、污染、区域效果或特殊空间。
2. 判断其是否影响移动、感知、攻击、施法、伤害或状态。
3. 抽取作用范围、触发条件、持续时间和解除方式。
4. 建立环境与地点、场景、探索、战斗规则的连接。
5. 输出 environment_entity logic，用于场景判定。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "环境实体系统"
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

- EnvironmentEntity LOCATED_AT Location
- EnvironmentEntity MODIFIES Check
- EnvironmentEntity MODIFIES Movement
- EnvironmentEntity DEALS Damage
- EnvironmentEntity APPLIES Status

## 11. 输出 Logic 模板

```yaml
环境实体系统_logic:
  canonical_system: "环境实体系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "环境实体系统"
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
