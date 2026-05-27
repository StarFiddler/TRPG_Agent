# Skill：GameMapTopologyBuilder_v3.0

---

# 一、Skill定位

该 Skill 用于从游戏资料中构建：

分布式地图拓扑系统 + 可计算空间模型 + 一致性验证系统

输出结果必须满足：

* 可遍历
* 可计算
* 可复现
* 可验证

---

# 二、传入参数

```json
{
  "game_name": "string",
  "reference_links": ["string"],
  "constraints": {
    "required_worlds": ["string"],
    "include_dlc": true,
    "include_all_subregions": true,
    "include_all_dungeons": true,
    "consistency_check": true
  },
  "scale_config": {
    "world_radius_km": 1000,
    "auto_estimate_if_missing": true
  }
}
```

---

# 三、数据获取规则

## 3.1 自动检索规则

当 reference_links 为空时：

```text
<game_name> + map
```

要求：

* 至少获取 2 个来源
* 必须交叉验证区域结构

---

## 3.2 冲突解决规则

当结构冲突时：

1. 选择区域粒度更细者
2. 选择覆盖范围更完整者
3. 官方来源优先

---

# 四、世界结构定义

## 4.1 完整地图定义

必须包含：

* 主世界
* DLC世界
* 所有可探索区域

---

## 4.2 排除项

不包含：

* 纯战斗实例
* Cutscene场景
* 临时剧情空间

---

# 五、节点分类系统

## Non-Key Node

* 地牢
* 洞窟
* 副本
* 地下区域

---

## Key Node
所有的非Non-Key Node，且满足以下任一条件：

1. 支持快速传送
2. 存在保存点
3. 图中度数 ≥ 3
4. 官方标记主节点

---



# 六、拓扑构建规则

## 6.1 图模型

```text
Graph = (V, E)

V = Key Nodes
E = 可通行路径
```

---

## 6.2 连通性约束

必须满足：

* 全图连通
* 无孤立节点
* 每个区域至少一个入口节点

---

# 七、尺度系统

## 7.1 世界半径

```text
R = world_radius_km
```

---

## 7.2 自动推断规则

当未提供时：

```json
{
  "scale_inference": {
    "world_radius_km": 800,
    "confidence": "medium",
    "method": "region_density_estimation"
  }
}
```

---

## 7.3 半径分类

| 类型   | 半径          |
| ---- | ----------- |
| 小型世界 | 5–50 km     |
| 中型世界 | 50–300 km   |
| 大型世界 | 300–1500 km |

---

# 八、距离计算系统

## 8.1 基础公式

```text
distance_km(i,j) = (R × W_region) / D_avg
```

---

## 8.2 参数定义

* R：世界半径
* W_region：区域权重
* D_avg：平均路径深度

---

## 8.3 区域权重

| 类型   | 权重  |
| ---- | --- |
| 核心区域 | 1.2 |
| 普通区域 | 1.0 |
| 边缘区域 | 0.7 |

---

## 8.4 约束

* 主路径 ≥ 5 km
* 非关键路径 ≤ 主路径 × 0.6
* 不允许全图等距

---

# 九、方向系统

## 9.1 基础方向

```text
N / E / S / W
```

---

## 9.2 扩展方向规则

```text
bearing = 基础方向 + 偏移角
```

角度：

* 15°
* 30°
* 45°

示例：

```text
北偏东30°
南偏西15°
```

---

# 十、文件结构定义

## 10.1 MAP_总览.json

```json
{
  "worlds": [],
  "world_name": "",
  "scale": {
    "world_radius_km": 1000
  },
  "major_region_graph": {},
  "region_hierarchy": {},
  "all_major_region_files": [],
  "all_minor_region_files": [],
  "stats": {
    "total_regions": 0,
    "total_nodes": 0
  }
}
```

---

## 10.2 大地图文件

```json
{
  "region_name": "",
  "sub_regions": [],
  "sub_region_graph": {},
  "sub_region_files": []
}
```

---

## 10.3 小地图文件

### key_grace_graph

```json
{
  "node_id": {
    "N": {
      "to": "node_id",
      "distance_km": 12.3
    }
  }
}
```

---

### non_key_mapping

```json
[
  {
    "id": "dungeon_001",
    "name": "",
    "nearest_key_grace": "",
    "bearing": "北偏东30°",
    "distance_km": 5.2
  }
]
```

---

# 十一、一致性校验系统

输出：

```json
{
  "consistency_report": {
    "region_count_match": true,
    "file_count_match": true,
    "all_nodes_connected": true,
    "missing_files": [],
    "isolated_nodes": []
  }
}
```

---

# 十二、执行流程

```text
Step 1：解析参数
Step 2：加载数据源
Step 3：构建世界结构
Step 4：构建区域层级
Step 5：构建拓扑图
Step 6：计算尺度
Step 7：计算距离
Step 8：生成JSON文件
Step 9：执行一致性校验
Step 10：输出结果
```

---

# 十三、完成判定

必须满足：

* 全区域生成
* 全地牢覆盖
* 图完全连通
* 距离全部存在
* 校验通过

---

# 十四、API级 System Prompt

You are a deterministic Game Map Topology Builder.

You must:

1. Build a complete distributed map system.
2. Include all regions and dungeons.
3. Use verified wiki sources.
4. Resolve conflicts deterministically.
5. Construct a fully connected graph.
6. Apply a consistent scale model.
7. Compute distances using defined formulas.
8. Assign bearings using fixed rules.
9. Generate all required JSON files.
10. Validate consistency before output.

You must produce a complete and verified system.

---

# 十五、一句话总结

构建可复现、可计算、可验证的地图拓扑系统。
