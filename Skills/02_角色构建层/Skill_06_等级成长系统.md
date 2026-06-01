# 角色构建层：等级成长系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【等级成长系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "角色构建层"
  target_system: "等级成长系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "等级成长系统"
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

可映射到本系统的常见近似术语包括：等级、成长、突破、升阶、进化、星级、练度、经验值、里程碑、技能树进度。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【等级成长系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 当前等级
- 总等级
- 经验值
- 升级条件
- 等级收益
- 能力解锁
- 资源成长
- 属性提升

## 6. 核心属性字段

- progression_id
- current_level
- total_level
- experience
- milestone
- level_rewards
- attribute_increase
- feature_unlocks
- resource_growth
- future_path

## 7. 依赖关系

- 职业系统
- 子职业、专精或流派系统
- 基础属性系统
- 专长、天赋与特性系统
- 法术与能力列表系统

## 8. 处理流程

1. 识别作品中的等级、突破、练度、升星、进化、里程碑等成长机制。
2. 判断成长带来的数值、能力、资源、权限或剧情变化。
3. 将成长阶段映射为 progression 节点。
4. 记录每一阶段的解锁内容与前置条件。
5. 输出 progression logic，支持当前能力回溯与未来成长规划。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "等级成长系统"
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

- Character HAS_LEVEL Progression
- Progression UNLOCKS Feature
- Progression INCREASES Attribute
- Progression MODIFIES Resource
- Progression ENABLES Subclass

## 11. 输出 Logic 模板

```yaml
等级成长系统_logic:
  canonical_system: "等级成长系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "等级成长系统"
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
