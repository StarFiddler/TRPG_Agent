# 角色构建层：基础属性系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【基础属性系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "角色构建层"
  target_system: "基础属性系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "基础属性系统"
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

可映射到本系统的常见近似术语包括：属性、能力值、六维、三围、资质、参数、能力参数、力量/敏捷/体质、HP以外的基础能力。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【基础属性系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 核心属性
- 属性值
- 属性修正
- 属性成长
- 属性上限与下限
- 临时属性变化
- 永久属性变化

## 6. 核心属性字段

- attribute_id
- attribute_name
- source_term
- normalized_term
- value
- modifier
- growth_rule
- cap_rule
- affected_checks
- affected_resources

## 7. 依赖关系

- 检定系统
- 技能与熟练系统
- 职业系统
- 等级成长系统
- 装备构建系统
- 角色状态快照系统

## 8. 处理流程

1. 读取作品中描述角色基础能力的术语。
2. 判断其是否承担数值修正、行动成功率、资源上限或战斗表现功能。
3. 将不同作品中的力量、灵巧、智力、精神、意志等术语映射为标准属性节点。
4. 记录属性对检定、资源、装备、能力和成长的影响。
5. 输出可被角色构建层与规则执行层共同调用的 attribute logic。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "基础属性系统"
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

- Character HAS_ATTRIBUTE Attribute
- Attribute MODIFIES Check
- Attribute AFFECTS Resource
- SourceTerm MAPS_TO Attribute
- Attribute DERIVED_FROM SourceText

## 11. 输出 Logic 模板

```yaml
基础属性系统_logic:
  canonical_system: "基础属性系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "基础属性系统"
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
