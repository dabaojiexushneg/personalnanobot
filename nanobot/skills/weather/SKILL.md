---
name: weather
description: 查询当前天气和天气预报，无需 API Key。优先使用 wttr.in，程序化 JSON 场景可使用 Open-Meteo。
homepage: https://wttr.in/:help
metadata: {"nanobot":{"emoji":"🌤️","requires":{"bins":["curl"]}}}
---

# 天气技能

提供两个免费天气服务，均不需要 API Key。

## wttr.in（优先）

快速查询：

```bash
curl -s "wttr.in/London?format=3"
# 输出：London: ⛅️ +8°C
```

紧凑格式：

```bash
curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"
# 输出：London: ⛅️ +8°C 71% ↙5km/h
```

完整预报：

```bash
curl -s "wttr.in/London?T"
```

格式代码：`%c` 天气情况，`%t` 温度，`%h` 湿度，`%w` 风，`%l` 位置，`%m` 月相。

提示：

- 城市名中的空格需要 URL 编码，例如 `wttr.in/New+York`。
- 可使用机场代码，例如 `wttr.in/JFK`。
- 单位：`?m` 公制，`?u` 美制。
- 只看今天：`?1`；只看当前天气：`?0`。
- PNG 输出：`curl -s "wttr.in/Berlin.png" -o /tmp/weather.png`。

## Open-Meteo（JSON 兜底）

免费、无需 key，适合程序化处理：

```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
```

先查城市经纬度，再请求 forecast 接口。返回 JSON，包含温度、风速、天气代码等字段。

文档：https://open-meteo.com/en/docs
