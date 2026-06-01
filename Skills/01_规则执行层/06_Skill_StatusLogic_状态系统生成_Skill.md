## 6. Skill_StatusLogic：状态系统生成 Skill

该 Skill 用于生成增益、减益、控制、异常、姿态、标记、诅咒、污染、精神影响等状态逻辑。

### input

input 可以包括：

状态说明；
异常效果说明；
Buff/Debuff 文本；
控制效果；
元素异常；
精神影响；
诅咒与祝福；
姿态系统；
标记系统；
疾病与毒素文本。

### 处理目标

该 Skill 需要将不同作品中的“持续性效果”统一抽象为 StatusLogic。

需要兼容的近似术语包括：

状态；
Buff；
Debuff；
异常；
控制；
增益；
减益；
标记；
诅咒；
祝福；
中毒；
燃烧；
流血；
冰冻；
麻痹；
眩晕；
恐惧；
魅惑；
沉默；
束缚；
隐身；
破甲；
虚弱；
狂暴；
污染；
理智下降。

### output

输出为该作品的 StatusLogic，至少包括：

状态名称；
状态类型；
状态来源；
状态目标；
状态持续时间；
状态叠加规则；
状态互斥规则；
状态刷新规则；
状态解除条件；
状态对行动的影响；
状态对移动的影响；
状态对攻击的影响；
状态对防御的影响；
状态对判定的影响；
状态对资源的影响；
状态结束时是否产生后续效果。

### logic 抽象格式

```yaml
StatusLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 状态
    - 异常
    - Buff
    - Debuff
    - 控制
    - 标记
  status_name: 状态名称或作品原术语
  normalized_status_type: 增益、减益、控制、持续伤害、持续治疗、标记、姿态、诅咒或特殊状态
  source: 状态来源
  target: 状态承受者
  duration: 持续时间、回合数、场景持续、直到解除或永久
  stack_rule: 可叠加、刷新、覆盖、互斥或转化
  effect_hooks:
    action: 对行动的影响
    movement: 对移动的影响
    attack: 对攻击的影响
    defense: 对防御的影响
    check: 对判定的影响
    resource: 对资源的影响
  removal_rule: 自然结束、判定解除、治疗解除、驱散解除、环境解除或剧情解除
  state_writeback: 写入状态列表、持续时间、叠加层数、解除记录或后续触发
```

该 Skill 的作用是把不同作品中“角色或实体处于什么持续影响下”的机制转化为统一逻辑。
