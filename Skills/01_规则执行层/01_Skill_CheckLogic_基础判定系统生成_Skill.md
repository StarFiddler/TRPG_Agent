## 1. Skill_CheckLogic：基础判定系统生成 Skill

该 Skill 用于从任意 ACGN 作品或规则资料中抽象出“基础判定系统”。

### input

input 可以包括：

作品名称；
wiki 文档；
规则书片段；
角色属性说明；
技能说明；
行动判定说明；
战斗记录；
GM 自制规则；
玩家行为描述。

### 处理目标

该 Skill 需要识别该作品中是否存在类似“检定”的机制，并将其统一抽象为 CheckLogic。

需要兼容的近似术语包括：

检定；
判定；
测试；
挑战；
试炼；
属性判定；
技能判定；
命中判定；
成功率判定；
难度判定；
抗性判定；
豁免；
意志抵抗；
精神抵抗；
体质抵抗；
命运判定。

### output

输出为该作品的 CheckLogic，至少包括：

判定触发条件；
判定对象；
判定使用的基础属性；
判定使用的技能或能力；
判定随机源，如骰子、百分比、固定阈值、抽卡、牌组、对照表或纯叙事裁定；
判定难度来源；
成功条件；
失败条件；
大成功条件；
大失败条件；
修正值来源；
加成与减值来源；
优势与劣势或等价机制；
是否允许协助；
是否允许重试；
失败后是否产生代价；
结果是否写回战役状态。

### logic 抽象格式

```yaml
CheckLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 检定
    - 判定
    - 测试
    - 挑战
    - 豁免
  trigger: 角色行为或环境事件触发
  actor: 发起判定的角色、NPC或实体
  target: 被影响对象、环境、难度或对抗方
  base_attribute: 从作品资料中抽取的基础属性
  skill_or_method: 从作品资料中抽取的技能、技巧、经验、熟练或能力
  randomizer: 骰子、百分比、抽卡、表格、固定阈值或GM裁定
  modifiers: 来自属性、装备、状态、环境、能力、关系或剧情的修正
  difficulty: 固定难度、对方数值、环境难度、剧情难度或GM裁定难度
  result_branches:
    critical_success: 大成功或特殊成功
    success: 成功
    partial_success: 有代价的成功
    failure: 失败
    critical_failure: 大失败或灾难性失败
  state_writeback: 判定后写入角色状态、场景状态、任务状态或资源状态
```

该 Skill 的作用是把任意作品中“是否成功”的基础机制转化为统一的可运行逻辑。
