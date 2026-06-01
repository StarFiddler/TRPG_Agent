# Elden Ring TRPG World Base：规则执行层

生成日期：2026-06-01

本包根据仓库 `StarFiddler/TRPG_Agent` 当前结构中的 `Skills/01_规则执行层` 执行生成。用户输入参数为：

> 艾尔登法环及该游戏相关的所有wiki等参考链接

## 生成范围

本包只执行规则执行层，不直接展开全量地图、全量道具、全量 NPC 或完整剧情数据库。它提供 TRPG 运行时“如何判定”的底层 world_base，供后续 02_角色构建层、03_内容实体层、04_叙事运行层继续调用。

## 已执行规则 Skill

1. CheckLogic 基础判定系统
2. ContestLogic 对抗系统
3. ActionEconomyLogic 行动经济系统
4. AttackDefenseLogic 攻击与防御系统
5. DamageHealingLogic 伤害与治疗系统
6. StatusLogic 状态系统
7. ResourceLogic 资源消耗系统
8. RestRecoveryLogic 休息与恢复系统
9. ExplorationTravelLogic 探索与旅行系统
10. SocialInteractionLogic 社交互动系统
11. AbilityExecutionLogic 魔法、技能与特殊能力执行系统
12. RulePriorityLogic 规则优先级与例外系统

## 项目硬约束

- 赐福在跑团中可统一称为“篝火”，并作为默认安全区。
- 固定掉落、固定奖励和关键道具必须按 Wiki 核验，不能杜撰。
- 交界地默认采用 1000km 级硬尺度；幽影地作为独立世界层级挂载。
- 地牢内允许骨灰持续随行，直到死亡、遣返、切换召唤组或 GM 封锁。
- 默认判定使用 d100，并保留 target、roll、margin 与 rule_trace。

## 文件说明

- `world_base.json`：完整规则执行层 world_base。
- `rules/*.json`：12 个规则 Skill 的独立执行结果。
- `schema/world_base.schema.json`：简化结构校验 Schema。
- `prompts/runtime_prompt.md`：可直接复制给 GM Agent 的运行 Prompt。
- `reports/RECHECK_REPORT.md`：一致性检查报告。
