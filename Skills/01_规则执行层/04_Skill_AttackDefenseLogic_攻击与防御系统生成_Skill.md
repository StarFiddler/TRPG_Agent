## 4. Skill_AttackDefenseLogic：攻击与防御系统生成 Skill

该 Skill 用于生成攻击、命中、防御、护甲、闪避、招架、格挡、掩体等攻防逻辑。

### input

input 可以包括：

武器规则；
命中说明；
防御说明；
护甲说明；
闪避、招架、格挡文本；
远程攻击规则；
近战攻击规则；
技能攻击规则；
Boss 攻击机制；
弹幕、范围攻击或锁定规则。

### 处理目标

该 Skill 需要将不同作品中的“攻击是否成立”统一抽象为 AttackDefenseLogic。

需要兼容的近似术语包括：

攻击；
命中；
闪避；
招架；
格挡；
防御；
护甲；
装甲；
AC；
防御等级；
防御力；
回避率；
命中率；
破防；
格挡值；
护盾；
掩体；
弹反。

### output

输出为该作品的 AttackDefenseLogic，至少包括：

攻击类型；
攻击者；
防御者；
攻击距离；
攻击判定；
防御判定或固定防御值；
命中条件；
未命中结果；
暴击或精准命中条件；
掩体、距离、视野、高低差等修正；
招架、闪避、格挡或护盾处理；
命中后是否进入伤害逻辑；
防御成功是否触发反击或状态变化。

### logic 抽象格式

```yaml
AttackDefenseLogic:
  source_input: 任意ACGN作品名称或wiki文档
  canonical_terms:
    - 攻击
    - 命中
    - 防御
    - 护甲
    - 闪避
    - 招架
    - 格挡
  attacker: 攻击者
  defender: 防御者
  attack_method: 武器、技能、法术、异能、环境或剧情攻击
  attack_check: 调用CheckLogic或固定命中规则
  defense_value: 护甲、防御等级、回避、格挡、护盾或等价防御值
  defense_response: 闪避、招架、格挡、反制、护盾吸收或无反应
  modifiers: 距离、视野、掩体、高低差、状态、装备、体型或环境修正
  hit_rule: 命中条件
  miss_rule: 未命中结果
  critical_rule: 暴击、弱点命中、精准命中或特殊命中规则
  next_logic: 命中后调用DamageHealingLogic或StatusLogic
  state_writeback: 写入命中、未命中、姿态、护盾变化、位置变化或反击窗口
```

该 Skill 的作用是把不同作品中“攻击如何作用于目标”的机制转化为统一逻辑。
