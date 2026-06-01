## 10. Skill_SocialInteractionLogic：社交互动系统生成 Skill

该 Skill 用于生成说服、欺瞒、威吓、洞察、交易、审问、伪装、声望、派系态度等逻辑。

### input

input 可以包括：

NPC 设定；
派系设定；
声望系统；
对话规则；
谈判规则；
好感度系统；
任务对话；
交易规则；
社交技能说明；
剧情分支文本。

### 处理目标

该 Skill 需要将不同作品中的“人与人、人与组织之间的互动规则”统一抽象为 SocialInteractionLogic。

需要兼容的近似术语包括：

说服；
欺瞒；
威吓；
洞察；
交涉；
谈判；
交易；
审问；
伪装；
表演；
礼仪；
好感度；
信赖；
声望；
阵营；
派系态度；
敌意；
友善；
魅力判定；
心理战。

### output

输出为该作品的 SocialInteractionLogic，至少包括：

互动发起者；
互动对象；
互动目标；
NPC 当前态度；
派系关系；
可用社交方式；
社交判定逻辑；
难度来源；
禁忌条件；
成功结果；
失败结果；
声望变化；
关系变化；
任务变化；
是否触发敌对、交易、情报、协助或背叛。

### logic 抽象格式

```yaml
SocialInteractionLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 说服
    - 欺瞒
    - 威吓
    - 洞察
    - 好感度
    - 声望
    - 派系态度
  actor: 社交发起者
  target: NPC、群体、派系、组织或怪物
  intent: 说服、欺骗、威吓、交易、审问、求助、挑衅或伪装
  relationship_context: 好感、敌意、信任、恐惧、利益、阵营、派系关系或历史事件
  check_logic: 调用CheckLogic或纯剧情条件
  difficulty_source: NPC性格、派系立场、证据、利益、禁忌、身份或剧情状态
  success_effect: 情报、协助、交易、任务推进、关系改善或冲突缓和
  failure_effect: 拒绝、敌意、关系恶化、任务失败、警报或战斗触发
  state_writeback: 写入NPC态度、派系声望、任务状态、线索状态或剧情标记
```

该 Skill 的作用是把不同作品中“社交行为如何改变关系和剧情”的机制转化为统一逻辑。
