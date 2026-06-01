## 3. Skill_ActionEconomyLogic：行动经济系统生成 Skill

该 Skill 用于生成回合、行动、反应、移动、追加行动、自由行动等规则逻辑。

### input

input 可以包括：

战斗回合说明；
行动点系统；
速度与移动规则；
技能释放规则；
冷却规则；
连击规则；
即时反应规则；
队伍行动顺序；
敌我行动流程；
时间单位说明。

### 处理目标

该 Skill 需要识别作品中的“行动资源结构”，并将其统一抽象为 ActionEconomyLogic。

需要兼容的近似术语包括：

行动；
主行动；
副行动；
附赠行动；
反应；
即时行动；
移动；
行动点；
AP；
SP；
回合；
轮次；
读条；
冷却；
连携；
追击；
插入行动；
准备动作；
待机；
打断。

### output

输出为该作品的 ActionEconomyLogic，至少包括：

时间单位；
回合结构；
行动类型；
每回合可用行动资源；
行动之间的互斥关系；
行动与移动的关系；
反应或打断的触发条件；
技能冷却或次数限制；
额外行动来源；
行动失败后的资源消耗规则；
行动是否可被准备、延迟或取消；
行动结果如何进入下一阶段。

### logic 抽象格式

```yaml
ActionEconomyLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 行动
    - 主行动
    - 副行动
    - 反应
    - 移动
    - 行动点
    - 冷却
  time_unit: 回合、轮次、秒、阶段、读条或叙事时间片
  available_actions:
    primary_action: 主要行动或等价行为
    secondary_action: 次要行动、附赠行动或等价行为
    reaction_action: 反应、打断、招架、反击或等价行为
    movement_action: 移动、位移、冲刺、传送或等价行为
    free_action: 低成本交互或叙事动作
  resource_cost: 行动点、次数、冷却、体力、法力、怒气或无消耗
  mutual_exclusion: 行动之间的互斥与替代关系
  trigger_window: 反应、打断、追击、连携的触发时机
  failure_consumption: 行动失败后是否消耗资源
  state_writeback: 写入已行动、冷却、位置、姿态或回合阶段
```

该 Skill 的作用是把不同作品中“一个单位现在能做什么”的规则转化为统一逻辑。
