# skillX_RPGItemDictGenerator.md

## 一、Skill名称
RPG全道具系统生成器（RPG Item Dict Generator）

---

## 二、Skill目标
输入一个RPG游戏名称，自动构建该游戏的【完整道具系统数据结构】，并输出为结构化JSON文件压缩包。

---

## 三、适用范围
适用于所有具备以下系统的RPG游戏：

- 道具系统（Item System）
- 装备系统（Equipment System）
- 技能/能力附着系统（Skill Attachment，如战灰/附魔）
- 消耗品系统（Consumables）
- 法术系统（Magic / Ability System）
- 关键道具系统（Key Items / Quest Items）

---

## 四、输入参数（Input）

### 必填参数
- <game_name>：游戏名称（字符串）

### 可选参数
- <reference_links>：WIKI/API/数据库链接（若无则自动联网检索）

---

## 五、输出参数（Output）

一个压缩包（.zip），包含以下结构：

ITEM_DICT_PACKAGE.zip
│
├── weapons.json
├── armors.json
├── consumables.json
├── accessories.json
├── skills.json
├── magic.json
├── key_items.json
├── crafting_materials.json
└── META.json

---

## 六、核心数据结构定义（统一标准）

### 1. 通用Item Dict结构

{
  "ItemName": {
    "acquisition": "获取方式/地点",
    "effect": {},
    "summary": "≤15字精炼描述"
  }
}

---

### 2. 分类结构规范（专业术语抽象）

#### 【Weapon（武器）】
"effect": {
  "category": "武器类型",
  "attack_power": {},
  "scaling": {},
  "damage_type": [],
  "special_effect": []
}

---

#### 【Armor（防具）】
"effect": {
  "slot": "部位（Head/Chest/Hands/Legs）",
  "defense": {},
  "resistance": {},
  "weight": number,
  "special_effect": []
}

---

#### 【Consumable（消耗品）】
"effect": {
  "type": "heal/buff/offense",
  "value": number,
  "duration": number,
  "status_effect": []
}

---

#### 【Accessory / Talisman（饰品）】
"effect": {
  "passive_bonus": [],
  "trigger_effect": []
}

---

#### 【Skill / Ability（技能/战技）】
"effect": {
  "cost": {},
  "cooldown": number,
  "scaling": {},
  "effect_type": []
}

---

#### 【Magic / Spell（法术/祷告）】
"effect": {
  "cost": {},
  "cast_time": number,
  "damage": {},
  "status_effect": []
}

---

#### 【Key Item（关键道具）】
"effect": {
  "usage": "用途描述",
  "unlock": []
}

---

#### 【Crafting Material（制作材料）】
"effect": {
  "used_for": [],
  "rarity": "common/uncommon/rare"
}

---

## 七、执行流程（Pipeline）

### Step 1：数据源构建
- 若提供 <reference_links> → 直接解析
- 否则执行：
  - 自动检索官方WIKI / 数据库
  - 优先使用结构化数据源（API / JSON）

---

### Step 2：道具分类识别
识别并归类为：

- Weapon
- Armor
- Consumable
- Accessory
- Skill
- Magic
- Key Item
- Material

---

### Step 3：字段标准化
统一映射为：

- acquisition（获取方式）
- effect（结构化效果）
- summary（≤15字）

---

### Step 4：数据清洗
- 删除所有背景故事
- 删除冗余描述
- 精炼为功能性数据

---

### Step 5：数值补全规则
- 若存在明确数值 → 必须保留
- 若无 → 填充为 null
- 禁止虚构数值

---

### Step 6：一致性校验
- 道具总数校验（与数据源一致）
- 分类完整性校验
- 重复项去重

---

### Step 7：文件生成
- 按分类生成多个 JSON
- 生成 META.json：

{
  "game": "<game_name>",
  "total_items": number,
  "categories": {},
  "data_source": []
}

---

### Step 8：压缩输出
生成：

<game_name>_ITEM_DICT.zip

---

## 八、约束条件（Constraints）

1. 不记录任何背景故事
2. summary ≤ 15字
3. 所有字段结构统一
4. 不允许虚构数据
5. 获取方式必须尽可能具体
6. 数值类装备必须结构化存储

---

## 九、容错策略（Fallback）

当数据不完整时：

- acquisition → "unknown"
- effect字段 → null 或最小结构
- 记录至 META.json 的 missing_data

---

## 十、Skill特性

- 通用RPG适配
- 自动结构化
- 可用于数据库/检索系统
- 可直接作为TRPG数据源
- 支持后续Skill链调用

---

## 十一、调用示例

Input:
<game_name> = "Elden Ring"

Output:
EldenRing_ITEM_DICT.zip

---

## 十二、扩展接口（可选）

支持追加：

- 多语言映射
- 掉落概率统计
- 商人/交易系统绑定
- 地图节点关联

extension: item → map_node
