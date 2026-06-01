## 11. Skill_AbilityExecutionLogic：魔法、技能与特殊能力执行系统生成 Skill

该 Skill 用于生成法术、技能、异能、咒术、战技、宝具、天赋、职业能力、怪物能力、装备能力等执行逻辑。

### input

input 可以包括：

能力说明；
技能说明；
法术说明；
职业能力；
怪物能力；
装备效果；
角色天赋；
世界观超自然规则；
wiki 技能表；
战斗日志。

### 处理目标

该 Skill 需要将不同作品中的“特殊能力如何发动并结算”统一抽象为 AbilityExecutionLogic。

需要兼容的近似术语包括：

能力；
技能；
法术；
魔法；
咒术；
术式；
异能；
战技；
秘技；
奥义；
宝具；
天赋；
职业能力；
怪物能力；
装备效果；
被动；
主动；
光环；
领域；
召唤；
反制；
驱散。

### output

输出为该作品的 AbilityExecutionLogic，至少包括：

能力名称；
能力来源；
发动条件；
发动动作；
消耗资源；
作用目标；
作用范围；
持续时间；
是否需要维持或专注；
是否需要命中判定；
是否允许抵抗或豁免；
是否造成伤害；
是否附加状态；
是否召唤实体；
是否改变环境；
是否有升级或强化版本；
是否可被反制、打断、驱散或封印；
结算后写回哪些状态。

### logic 抽象格式

```yaml
AbilityExecutionLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 能力
    - 技能
    - 法术
    - 魔法
    - 异能
    - 战技
    - 宝具
  ability_name: 能力名称或作品原术语
  source: 职业、种族、装备、怪物、剧情、世界观、祝福、诅咒或自制规则
  activation_condition: 发动条件
  action_cost: 调用ActionEconomyLogic
  resource_cost: 调用ResourceLogic
  target_rule: 单体、范围、区域、自身、友方、敌方、地点或叙事目标
  resolution_rule:
    attack: 是否调用AttackDefenseLogic
    check: 是否调用CheckLogic
    contest: 是否调用ContestLogic
    damage: 是否调用DamageHealingLogic
    status: 是否调用StatusLogic
  duration_rule: 即时、持续、维持、集中、冷却、场景持续或永久
  counter_rule: 反制、打断、驱散、封印、免疫或无反制
  scaling_rule: 等级成长、资源强化、剧情强化、装备强化或无成长
  state_writeback: 写入资源、冷却、状态、召唤物、环境变化、任务标记或剧情后果
```

该 Skill 的作用是把不同作品中“特殊能力如何被发动、抵抗、结算和写回”的机制转化为统一逻辑。
