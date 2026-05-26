---
title: Calendar Toolbox API
---

## 包结构概览

库的代码组织在基础包 `com.onixbyte.calendar` 下，结构如下：

| 包 | 描述 |
|---|---|
| `com.onixbyte.calendar` | 根日历对象 |
| `com.onixbyte.calendar.component` | iCalendar 组件（VEVENT、VTODO 等） |
| `com.onixbyte.calendar.component.property` | 组件级属性 |
| `com.onixbyte.calendar.property` | 日历级属性 |
| `com.onixbyte.calendar.parameter` | iCalendar 属性参数 |
| `com.onixbyte.calendar.recurrence` | 重复规则类型 |
| `com.onixbyte.calendar.value` | 值类型 |
| `com.onixbyte.calendar.util` | 格式化工具类 |

---

## Calendar

表示 iCalendar（RFC 5545）VCALENDAR 容器的顶层对象。

```java
Calendar calendar = Calendar.builder()
    .withCalendarScale(...)
    .withMethod(...)
    .withProductIdentifier(...)
    .withVersion(...)
    .withOwner(...)
    .withPrimaryCalendar(...)
    .withPublishedTTL(...)
    .withCalendarDescription(...)
    .withCalendarName(...)
    .withCalendarId(...)
    .withCustomProperties(...)
    .withComponents(event, todo, ...)
    .build();

String icsContent = calendar.formatted();
```

### 日历属性

所有日历级属性位于 `com.onixbyte.calendar.property`，实现 `CalendarProperty` 接口。

| 类 | iCalendar 属性 | 描述 |
|---|---|---|
| `CalendarScale` | `CALSCALE` | 日历系统（例如 GREGORIAN） |
| `Method` | `METHOD` | iCalendar 方法（例如 PUBLISH、REQUEST） |
| `ProductIdentifier` | `PRODID` | 日历的产品标识符 |
| `Version` | `VERSION` | iCalendar 版本（例如 2.0） |
| `Owner` | `X-OWNER` | 日历所有者 |
| `PrimaryCalendar` | `X-PRIMARY-CALENDAR` | 是否为主日历 |
| `PublishedTTL` | `X-PUBLISHED-TTL` | 已发布日历的生存时间 |
| `CalendarDescription` | `X-CALENDAR-DESC` | 日历描述 |
| `CalendarName` | `X-CALENDAR-NAME` | 日历名称 |
| `CalendarId` | `X-CALENDAR-ID` | 日历标识符 |
| `CustomCalendarProperty` | `X-*` | 自定义日历属性 |

自定义属性使用 Builder 创建：

```java
var customProp = CustomCalendarProperty.builder()
    .withParameters(...)
    .build("X-MY-PROPERTY", "my-value");
```

> 注意：自定义属性名称**必须**以 `X-` 开头。

---

## 组件

组件是 iCalendar 对象的核心实体。每个组件实现 `CalendarComponent` 接口，并在 `BEGIN:TYPE` 和 `END:TYPE` 定界符之间渲染。

### Event（VEVENT）

表示一个预定的活动/事件。

```java
Event event = Event.builder()
    .withDateTimeStamp(dtstamp)        // 必需
    .withUniqueIdentifier(uid)         // 必需
    .withDateTimeStart(dtstart)
    .withDateTimeEnd(dtend)            // 与 duration 互斥
    .withDuration(duration)            // 与 dtend 互斥
    .withSummary(summary)
    .withDescription(description)
    .withClassification(classification)
    .withDateTimeCreated(dateTimeCreated)
    .withGeographicPosition(geoPos)
    .withLastModified(lastModified)
    .withLocation(location)
    .withOrganiser(organiser)
    .withPriority(priority)
    .withSequenceNumber(seqNumber)
    .withStatus(status)
    .withTimeTransparency(transparency)
    .withUniformResourceLocator(url)
    .withRecurrenceId(recurrenceId)
    .withRecurrenceRule(rrule)
    .withAttachments(attachments)
    .withAttendees(attendees)
    .withCategories(categories)
    .withComments(comments)
    .withContacts(contacts)
    .withExceptionDateTimes(exDates)
    .withRequestStatuses(statuses)
    .withRelated(related)
    .withResources(resources)
    .withRecurrenceDateTimes(rDates)
    .build();
```

### Todo（VTODO）

表示待办事项或任务。

```java
Todo todo = Todo.builder()
    .withDateTimeStamp(dtstamp)        // 必需
    .withUniqueIdentifier(uid)         // 必需
    .withSummary(summary)
    .withDateTimeStart(dtstart)
    .withDateTimeDue(due)              // 与 duration 互斥
    .withDuration(duration)            // 与 due 互斥
    .withDateTimeCompleted(completed)
    .withPercentComplete(percent)
    .withClassification(classification)
    .withDateTimeCreated(created)
    .withDescription(description)
    .withGeographicPosition(geoPos)
    .withLastModified(lastModified)
    .withLocation(location)
    .withOrganiser(organiser)
    .withPriority(priority)
    .withSequenceNumber(seq)
    .withStatus(status)
    .withRecurrenceId(recurId)
    .withRecurrenceRule(rrule)
    .withUniformResourceLocator(url)
    .withAttachments(attachments)
    .withAttendees(attendees)
    .withCategories(categories)
    .withComments(comments)
    .withContacts(contacts)
    .withExceptionDateTimes(exDates)
    .withRequestStatuses(statuses)
    .withRelatedToList(related)
    .withResources(resources)
    .withRecurrenceDateTimes(rDates)
    .build();
```

### Journal（VJOURNAL）

表示日记条目或笔记。

```java
Journal journal = Journal.builder()
    .withDateTimeStamp(dtstamp)        // 必需
    .withUniqueIdentifier(uid)         // 必需
    .withSummary(summary)
    .withClassification(classification)
    .withDateTimeCreated(created)
    .withDateTimeStart(dtstart)
    .withLastModified(lastModified)
    .withOrganiser(organiser)
    .withRecurrenceId(recurId)
    .withSequenceNumber(seq)
    .withStatus(status)
    .withUniformResourceLocator(url)
    .withRecurrenceRule(rrule)
    .withAttachments(attachments)
    .withAttendees(attendees)
    .withCategories(categories)
    .withComments(comments)
    .withContacts(contacts)
    .withDescriptions(descriptions)
    .withExceptionDateTimes(exDates)
    .withRelatedToList(related)
    .withRecurrenceDate(rDates)
    .withRequestStatuses(statuses)
    .build();
```

### FreeBusy（VFREEBUSY）

表示空闲/忙碌时间信息。

```java
FreeBusy freeBusy = FreeBusy.builder()
    .withDateTimeStamp(dtstamp)        // 必需
    .withUniqueIdentifier(uid)         // 必需
    .withContact(contact)
    .withDateTimeStart(dtstart)
    .withDateTimeEnd(dtend)
    .withOrganiser(organiser)
    .withUniformResourceLocator(url)
    .withAttendees(attendees)
    .withComments(comments)
    .withFreeBusyTimes(freeBusyTimes)
    .withRequestStatuses(statuses)
    .build();
```

### TimeZone（VTIMEZONE）

定义时区规则，包括标准时间和夏令时转换。

```java
TimeZone timezone = TimeZone.builder()
    .withTimeZoneIdentifier(tzId)
    .withLastModified(lastModified)
    .withTimeZoneUrl(tzUrl)
    .withTimeZoneProperties(standardProp, daylightProp)
    .build();
```

时区属性定义实际的转换规则：

```java
TimeZoneProperty standard = TimeZoneProperty.builder()
    .withDateTimeStart(dtstart)
    .withTimeZoneOffsetTo(offsetTo)
    .withTimeZoneOffsetFrom(offsetFrom)
    .withRecurrenceRule(rrule)
    .withTimeZoneNames(tzName)
    .buildStandard();                  // 或 buildDaylight()

TimeZoneProperty daylight = TimeZoneProperty.builder()
    .withDateTimeStart(dtstart)
    .withTimeZoneOffsetTo(offsetTo)
    .withTimeZoneOffsetFrom(offsetFrom)
    .buildDaylight();
```

### Alarm（VALARM）

定义闹钟/提醒通知。支持三种闹钟类型：

```java
// 音频闹钟
Alarm audioAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .withAttachments(audioAttachment)
    .buildAudio();

// 显示闹钟
Alarm displayAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDescription(description)      // 必需
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .buildDisplay();

// 邮件闹钟
Alarm emailAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDescription(description)      // 必需
    .withSummary(summary)              // 必需
    .withAttendees(attendees)          // 必需
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .buildEmail();
```

---

## 组件属性

组件属性位于 `com.onixbyte.calendar.component.property`，实现 `ComponentProperty` 接口。

| 类 | iCalendar 属性 | 描述 |
|---|---|---|
| `Action` | `ACTION` | 闹钟操作类型（AUDIO、DISPLAY、EMAIL） |
| `Attachment` | `ATTACH` | 文档附件 |
| `Attendee` | `ATTENDEE` | 事件/任务参与者 |
| `Categories` | `CATEGORIES` | 类别或标签 |
| `Classification` | `CLASS` | 访问分类（PUBLIC、PRIVATE、CONFIDENTIAL） |
| `Comment` | `COMMENT` | 评论 |
| `Contact` | `CONTACT` | 联系信息 |
| `DateTimeCompleted` | `COMPLETED` | 完成日期时间 |
| `DateTimeCreated` | `CREATED` | 创建日期时间 |
| `DateTimeDue` | `DUE` | 截止日期时间 |
| `DateTimeEnd` | `DTEND` | 结束日期时间 |
| `DateTimeStamp` | `DTSTAMP` | 日期时间戳 |
| `DateTimeStart` | `DTSTART` | 开始日期时间 |
| `Description` | `DESCRIPTION` | 描述 |
| `ExceptionDateTimes` | `EXDATE` | 例外日期时间 |
| `FreeBusyTime` | `FREEBUSY` | 空闲/忙碌时间段 |
| `GeographicPosition` | `GEO` | 地理位置（纬度/经度） |
| `LastModified` | `LAST-MODIFIED` | 最后修改日期时间 |
| `Location` | `LOCATION` | 地点 |
| `Organiser` | `ORGANIZER` | 组织者 |
| `PercentComplete` | `PERCENT-COMPLETE` | 完成百分比 |
| `Priority` | `PRIORITY` | 优先级 |
| `RecurrenceDateTimes` | `RDATE` | 重复日期时间 |
| `RecurrenceId` | `RECURRENCE-ID` | 重复实例标识符 |
| `RecurrenceRule` | `RRULE` | 重复规则 |
| `RelatedTo` | `RELATED-TO` | 相关组件引用 |
| `RepeatCount` | `REPEAT` | 闹钟重复次数 |
| `RequestStatus` | `REQUEST-STATUS` | 请求状态 |
| `Resources` | `RESOURCES` | 资源 |
| `SequenceNumber` | `SEQUENCE` | 序列号（修订版本） |
| `Status` | `STATUS` | 组件状态（TENTATIVE、CONFIRMED、CANCELLED 等） |
| `Summary` | `SUMMARY` | 标题或摘要 |
| `TimeTransparency` | `TRANSP` | 时间透明度（OPAQUE、TRANSPARENT） |
| `TimeZoneIdentifier` | `TZID` | 时区标识符 |
| `TimeZoneName` | `TZNAME` | 时区名称 |
| `TimeZoneOffsetFrom` | `TZOFFSETFROM` | 相对于 UTC 的时区偏移（原） |
| `TimeZoneOffsetTo` | `TZOFFSETTO` | 相对于 UTC 的时区偏移（目标） |
| `TimeZoneUrl` | `TZURL` | 时区 URL |
| `Trigger` | `TRIGGER` | 闹钟触发器 |
| `UniformResourceLocator` | `URL` | 关联 URL |
| `UniqueIdentifier` | `UID` | 唯一标识符 |
| `CustomComponentProperty` | `X-*` | 自定义组件属性 |

---

## 参数

参数位于 `com.onixbyte.calendar.parameter`，为组件属性提供额外限定。

| 类 | iCalendar 参数 | 描述 |
|---|---|---|
| `AlarmTriggerRelationship` | `RELATED` | 触发器关联（START、END） |
| `AlternateTextRepresentation` | `ALTREP` | 替代文本 URI |
| `CalendarUserType` | `CUTYPE` | 日历用户类型（INDIVIDUAL、GROUP、RESOURCE 等） |
| `CommonName` | `CN` | 通用名称 |
| `Delegatees` | `DELEGATED-TO` | 受托人 |
| `Delegators` | `DELEGATED-FROM` | 委托人 |
| `DirectoryEntryReference` | `DIR` | 目录条目 URI |
| `FormatType` | `FMTTYPE` | 格式类型（MIME 类型） |
| `FreeBusyTimeType` | `FBTYPE` | 空闲/忙碌时间类型 |
| `InlineEncoding` | `ENCODING` | 内联编码（BASE64） |
| `Language` | `LANGUAGE` | 语言 |
| `Membership` | `MEMBER` | 组成员 |
| `ParticipationRole` | `ROLE` | 参与角色（CHAIR、REQ-PARTICIPANT 等） |
| `ParticipationStatus` | `PARTSTAT` | 参与状态（ACCEPTED、DECLINED 等） |
| `RecurrenceIdentifierRange` | `RANGE` | 重复范围（THISANDPRIOR、THISANDFUTURE） |
| `RelationshipType` | `RELTYPE` | 关系类型（PARENT、CHILD、SIBLING） |
| `RsvpExpectation` | `RSVP` | RSVP 期望（TRUE、FALSE） |
| `SentBy` | `SENT-BY` | 发送者 |
| `TimeZoneIdentifier` | `TZID` | 时区标识符 |
| `ValueDataType` | `VALUE` | 值数据类型（DATE、DATE-TIME 等） |

---

## 递归类型

位于 `com.onixbyte.calendar.recurrence`。

| 类 | 描述 |
|---|---|
| `Frequency` | 重复频率常量（DAILY、WEEKLY、MONTHLY、YEARLY），用于重复规则 |
| `WeekdayNum` | 重复规则的星期序号（例如第 2 个星期一） |

---

## 值类型

位于 `com.onixbyte.calendar.value`。

| 类 | 描述 |
|---|---|
| `FreeBusyTimeValue` | 表示空闲/忙碌时间值 |
| `PeriodOfTime` | 表示一个时间段，包含开始和结束 |
| `PropertyValue` | 属性的基础值类型 |
| `UtcOffset` | UTC 偏移值（例如 `-05:00`、`+01:00`） |

---

## 格式化输出

所有组件和属性都提供 `formatted()` 方法，返回符合 iCalendar 规范的字符串。`Calendar.formatted()` 方法生成完整的 `.ics` 输出，包含 `BEGIN:VCALENDAR`/`END:VCALENDAR`。

```java
String ics = calendar.formatted();
// BEGIN:VCALENDAR
// CALSCALE:GREGORIAN
// METHOD:PUBLISH
// ...
// END:VCALENDAR
```
