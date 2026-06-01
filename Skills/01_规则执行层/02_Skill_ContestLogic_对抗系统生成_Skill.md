## 2. Skill_ContestLogic：对抗系统生成 Skill

该 Skill 用于生成角色与角色、角色与怪物、角色与环境、角色与陷阱、角色与剧情阻力之间的对抗逻辑。

### input

input 可以包括：

作品中的战斗规则；
敌我对抗说明；
技能对抗说明；
潜行与侦查说明；
精神控制与抵抗说明；
力量压制、技巧比拼或意志较量文本；
Boss 机制；
剧情冲突描述。

### 处理目标

该 Skill 需要将不同作品中的“双方比较机制”统一抽象为 ContestLogic。

需要兼容的近似术语包括：

对抗；
比拼；
较量；
抵抗；
豁免；
压制；
招架；
闪避；
看破；
识破；
反制；
突破；
破防；
精神抵抗；
意志对抗；
隐匿对察觉；
欺瞒对洞察。

### output

输出为该作品的 ContestLogic，至少包括：

主动方；
被动方；
对抗类型；
主动方使用的属性或能力；
被动方使用的属性或能力；
比较方式；
平局处理；
主动方成功结果；
被动方成功结果；
是否存在连续对抗；
是否存在阶段性优势；
是否允许反制、招架或闪避；
对抗结果是否影响后续难度；
对抗是否改变双方状态。

### logic 抽象格式

```yaml
ContestLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 对抗
    - 比拼
    - 抵抗
    - 反制
    - 闪避
    - 招架
  initiator: 主动方
  defender: 被动方
  initiator_check: 主动方调用的CheckLogic
  defender_check: 被动方调用的CheckLogic或固定防御值
  compare_method: 数值比较、阈值比较、成功等级比较或叙事比较
  tie_rule: 主动方胜、被动方胜、维持现状或触发二次判定
  success_effect: 主动方成功时的规则结果
  failure_effect: 被动方成功时的规则结果
  repeat_rule: 是否允许持续对抗、重试或多阶段解决
  state_writeback: 写入状态、位置、资源、敌意、任务进度或剧情标记
```

该 Skill 的作用是把不同作品中“双方如何较量”的机制转化为统一逻辑。
