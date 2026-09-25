---
title: Calendar Toolbox API
---

## Package Overview

The library is organised under the base package `com.onixbyte.calendar` with the following structure:

| Package                                    | Description                                |
| ------------------------------------------ | ------------------------------------------ |
| `com.onixbyte.calendar`                    | Root calendar object                       |
| `com.onixbyte.calendar.component`          | iCalendar components (VEVENT, VTODO, etc.) |
| `com.onixbyte.calendar.component.property` | Component-level properties                 |
| `com.onixbyte.calendar.property`           | Calendar-level properties                  |
| `com.onixbyte.calendar.parameter`          | iCalendar property parameters              |
| `com.onixbyte.calendar.recurrence`         | Recurrence rule types                      |
| `com.onixbyte.calendar.value`              | Value types                                |
| `com.onixbyte.calendar.util`               | Formatting utilities                       |

---

## Calendar

The top-level object representing an iCalendar (RFC 5545) VCALENDAR container.

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

### Calendar Properties

All calendar-level properties live in `com.onixbyte.calendar.property` and implement `CalendarProperty`.

| Class                    | iCalendar Property   | Description                               |
| ------------------------ | -------------------- | ----------------------------------------- |
| `CalendarScale`          | `CALSCALE`           | Calendar system (e.g., GREGORIAN)         |
| `Method`                 | `METHOD`             | iCalendar method (e.g., PUBLISH, REQUEST) |
| `ProductIdentifier`      | `PRODID`             | Product identifier of the calendar        |
| `Version`                | `VERSION`            | iCalendar version (e.g., 2.0)             |
| `Owner`                  | `X-OWNER`            | Owner of the calendar                     |
| `PrimaryCalendar`        | `X-PRIMARY-CALENDAR` | Whether this is a primary calendar        |
| `PublishedTTL`           | `X-PUBLISHED-TTL`    | Time-to-live for published calendar       |
| `CalendarDescription`    | `X-CALENDAR-DESC`    | Calendar description                      |
| `CalendarName`           | `X-CALENDAR-NAME`    | Calendar name                             |
| `CalendarId`             | `X-CALENDAR-ID`      | Calendar identifier                       |
| `CustomCalendarProperty` | `X-*`                | Custom calendar properties                |

Custom properties are created using a builder:

```java
var customProp = CustomCalendarProperty.builder()
    .withParameters(...)
    .build("X-MY-PROPERTY", "my-value");
```

> Note: Custom property names **must** start with `X-`.

---

## Components

Components represent the core entities in an iCalendar object. Each component implements `CalendarComponent` and is rendered between `BEGIN:TYPE` and `END:TYPE` delimiters.

### Event (VEVENT)

Represents a scheduled event.

```java
Event event = Event.builder()
    .withDateTimeStamp(dtstamp)        // required
    .withUniqueIdentifier(uid)         // required
    .withDateTimeStart(dtstart)
    .withDateTimeEnd(dtend)            // mutually exclusive with duration
    .withDuration(duration)            // mutually exclusive with dtend
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

### Todo (VTODO)

Represents a to-do item or task.

```java
Todo todo = Todo.builder()
    .withDateTimeStamp(dtstamp)        // required
    .withUniqueIdentifier(uid)         // required
    .withSummary(summary)
    .withDateTimeStart(dtstart)
    .withDateTimeDue(due)              // mutually exclusive with duration
    .withDuration(duration)            // mutually exclusive with due
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

### Journal (VJOURNAL)

Represents a journal entry or diary note.

```java
Journal journal = Journal.builder()
    .withDateTimeStamp(dtstamp)        // required
    .withUniqueIdentifier(uid)         // required
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

### FreeBusy (VFREEBUSY)

Represents free/busy time information.

```java
FreeBusy freeBusy = FreeBusy.builder()
    .withDateTimeStamp(dtstamp)        // required
    .withUniqueIdentifier(uid)         // required
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

### TimeZone (VTIMEZONE)

Defines time zone rules including standard and daylight saving time transitions.

```java
TimeZone timezone = TimeZone.builder()
    .withTimeZoneIdentifier(tzId)
    .withLastModified(lastModified)
    .withTimeZoneUrl(tzUrl)
    .withTimeZoneProperties(standardProp, daylightProp)
    .build();
```

Time zone properties define the actual transition rules:

```java
TimeZoneProperty standard = TimeZoneProperty.builder()
    .withDateTimeStart(dtstart)
    .withTimeZoneOffsetTo(offsetTo)
    .withTimeZoneOffsetFrom(offsetFrom)
    .withRecurrenceRule(rrule)
    .withTimeZoneNames(tzName)
    .buildStandard();                  // or buildDaylight()

TimeZoneProperty daylight = TimeZoneProperty.builder()
    .withDateTimeStart(dtstart)
    .withTimeZoneOffsetTo(offsetTo)
    .withTimeZoneOffsetFrom(offsetFrom)
    .buildDaylight();
```

### Alarm (VALARM)

Defines alarm/reminder notifications. Three alarm types are supported:

```java
// Audio alarm
Alarm audioAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .withAttachments(audioAttachment)
    .buildAudio();

// Display alarm
Alarm displayAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDescription(description)      // required
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .buildDisplay();

// Email alarm
Alarm emailAlarm = Alarm.builder()
    .withTrigger(trigger)
    .withDescription(description)      // required
    .withSummary(summary)              // required
    .withAttendees(attendees)          // required
    .withDuration(duration)
    .withRepeatCount(repeatCount)
    .buildEmail();
```

---

## Component Properties

Component properties live in `com.onixbyte.calendar.component.property` and implement `ComponentProperty`.

| Class                     | iCalendar Property | Description                                              |
| ------------------------- | ------------------ | -------------------------------------------------------- |
| `Action`                  | `ACTION`           | Alarm action type (AUDIO, DISPLAY, EMAIL)                |
| `Attachment`              | `ATTACH`           | Document attachment                                      |
| `Attendee`                | `ATTENDEE`         | Event/task attendee                                      |
| `Categories`              | `CATEGORIES`       | Categories or tags                                       |
| `Classification`          | `CLASS`            | Access classification (PUBLIC, PRIVATE, CONFIDENTIAL)    |
| `Comment`                 | `COMMENT`          | Comment                                                  |
| `Contact`                 | `CONTACT`          | Contact information                                      |
| `DateTimeCompleted`       | `COMPLETED`        | Completion date-time                                     |
| `DateTimeCreated`         | `CREATED`          | Creation date-time                                       |
| `DateTimeDue`             | `DUE`              | Due date-time                                            |
| `DateTimeEnd`             | `DTEND`            | End date-time                                            |
| `DateTimeStamp`           | `DTSTAMP`          | Date-time stamp                                          |
| `DateTimeStart`           | `DTSTART`          | Start date-time                                          |
| `Description`             | `DESCRIPTION`      | Description                                              |
| `ExceptionDateTimes`      | `EXDATE`           | Exception date-times                                     |
| `FreeBusyTime`            | `FREEBUSY`         | Free/busy time periods                                   |
| `GeographicPosition`      | `GEO`              | Geographic position (lat/long)                           |
| `LastModified`            | `LAST-MODIFIED`    | Last modified date-time                                  |
| `Location`                | `LOCATION`         | Location                                                 |
| `Organiser`               | `ORGANIZER`        | Event organiser                                          |
| `PercentComplete`         | `PERCENT-COMPLETE` | Completion percentage                                    |
| `Priority`                | `PRIORITY`         | Priority level                                           |
| `RecurrenceDateTimes`     | `RDATE`            | Recurrence date-times                                    |
| `RecurrenceId`            | `RECURRENCE-ID`    | Recurrence instance identifier                           |
| `RecurrenceRule`          | `RRULE`            | Recurrence rule                                          |
| `RelatedTo`               | `RELATED-TO`       | Related component reference                              |
| `RepeatCount`             | `REPEAT`           | Alarm repeat count                                       |
| `RequestStatus`           | `REQUEST-STATUS`   | Request status                                           |
| `Resources`               | `RESOURCES`        | Resources                                                |
| `SequenceNumber`          | `SEQUENCE`         | Sequence number (revision)                               |
| `Status`                  | `STATUS`           | Component status (TENTATIVE, CONFIRMED, CANCELLED, etc.) |
| `Summary`                 | `SUMMARY`          | Title or summary                                         |
| `TimeTransparency`        | `TRANSP`           | Time transparency (OPAQUE, TRANSPARENT)                  |
| `TimeZoneIdentifier`      | `TZID`             | Time zone identifier                                     |
| `TimeZoneName`            | `TZNAME`           | Time zone name                                           |
| `TimeZoneOffsetFrom`      | `TZOFFSETFROM`     | Time zone offset from UTC                                |
| `TimeZoneOffsetTo`        | `TZOFFSETTO`       | Time zone offset to UTC                                  |
| `TimeZoneUrl`             | `TZURL`            | Time zone URL                                            |
| `Trigger`                 | `TRIGGER`          | Alarm trigger                                            |
| `UniformResourceLocator`  | `URL`              | Associated URL                                           |
| `UniqueIdentifier`        | `UID`              | Unique identifier                                        |
| `CustomComponentProperty` | `X-*`              | Custom component properties                              |

---

## Parameters

Parameters in `com.onixbyte.calendar.parameter` provide additional qualifiers on component properties.

| Class                         | iCalendar Parameter | Description                                            |
| ----------------------------- | ------------------- | ------------------------------------------------------ |
| `AlarmTriggerRelationship`    | `RELATED`           | Trigger relationship (START, END)                      |
| `AlternateTextRepresentation` | `ALTREP`            | Alternate text URI                                     |
| `CalendarUserType`            | `CUTYPE`            | Calendar user type (INDIVIDUAL, GROUP, RESOURCE, etc.) |
| `CommonName`                  | `CN`                | Common name                                            |
| `Delegatees`                  | `DELEGATED-TO`      | Delegatees                                             |
| `Delegators`                  | `DELEGATED-FROM`    | Delegators                                             |
| `DirectoryEntryReference`     | `DIR`               | Directory entry URI                                    |
| `FormatType`                  | `FMTTYPE`           | Format type (MIME type)                                |
| `FreeBusyTimeType`            | `FBTYPE`            | Free/busy time type                                    |
| `InlineEncoding`              | `ENCODING`          | Inline encoding (BASE64)                               |
| `Language`                    | `LANGUAGE`          | Language                                               |
| `Membership`                  | `MEMBER`            | Group membership                                       |
| `ParticipationRole`           | `ROLE`              | Participation role (CHAIR, REQ-PARTICIPANT, etc.)      |
| `ParticipationStatus`         | `PARTSTAT`          | Participation status (ACCEPTED, DECLINED, etc.)        |
| `RecurrenceIdentifierRange`   | `RANGE`             | Recurrence range (THISANDPRIOR, THISANDFUTURE)         |
| `RelationshipType`            | `RELTYPE`           | Relationship type (PARENT, CHILD, SIBLING)             |
| `RsvpExpectation`             | `RSVP`              | RSVP expectation (TRUE, FALSE)                         |
| `SentBy`                      | `SENT-BY`           | Sent by                                                |
| `TimeZoneIdentifier`          | `TZID`              | Time zone identifier                                   |
| `ValueDataType`               | `VALUE`             | Value data type (DATE, DATE-TIME, etc.)                |

---

## Recurrence Types

Located in `com.onixbyte.calendar.recurrence`.

| Class        | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| `Frequency`  | Frequency constants (DAILY, WEEKLY, MONTHLY, YEARLY) for recurrence rules |
| `WeekdayNum` | Weekday number for recurrence rules (e.g., 2nd Monday)                    |

---

## Value Types

Located in `com.onixbyte.calendar.value`.

| Class               | Description                                    |
| ------------------- | ---------------------------------------------- |
| `FreeBusyTimeValue` | Represents free/busy time value                |
| `PeriodOfTime`      | Represents a period of time with start and end |
| `PropertyValue`     | Base value type for properties                 |
| `UtcOffset`         | UTC offset value (e.g., `-05:00`, `+01:00`)    |

---

## Formatted Output

All components and properties provide a `formatted()` method that returns an iCalendar-compliant string representation. The `Calendar.formatted()` method produces a complete `.ics` output wrapped in `BEGIN:VCALENDAR`/`END:VCALENDAR`.

```java
String ics = calendar.formatted();
// BEGIN:VCALENDAR
// CALSCALE:GREGORIAN
// METHOD:PUBLISH
// ...
// END:VCALENDAR
```
