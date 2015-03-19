/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2014 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * SonarQube is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * SonarQube is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
package org.sonar.test;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import javax.annotation.CheckForNull;
import javax.annotation.Nullable;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Not thread-safe because of field datetimeFormat which is SimpleDateFormat.
 */
class JsonComparison {

  private static final SimpleDateFormat datetimeFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

  private boolean strictTimezone = false;
  private boolean strictArrayOrder = false;

  boolean isStrictTimezone() {
    return strictTimezone;
  }

  JsonComparison setStrictTimezone(boolean b) {
    this.strictTimezone = b;
    return this;
  }

  boolean isStrictArrayOrder() {
    return strictArrayOrder;
  }

  JsonComparison setStrictArrayOrder(boolean b) {
    this.strictArrayOrder = b;
    return this;
  }

  boolean areSimilar(String expected, String actual) {
    Object expectedJson = parse(expected);
    Object actualJson = parse(actual);
    return compare(expectedJson, actualJson);
  }

  private Object parse(String s) {
    try {
      JSONParser parser = new JSONParser();
      return parser.parse(s);
    } catch (Exception e) {
      throw new IllegalStateException("Invalid JSON: " + s, e);
    }
  }

  private boolean compare(@Nullable Object expectedObject, @Nullable Object actualObject) {
    if (expectedObject == null) {
      return actualObject == null;
    }
    if (actualObject == null) {
      return false;
    }
    if (expectedObject.getClass() != actualObject.getClass()) {
      return false;
    }
    if (expectedObject instanceof JSONArray) {
      return compareArrays((JSONArray) expectedObject, (JSONArray) actualObject);
    }
    if (expectedObject instanceof JSONObject) {
      return compareMaps((JSONObject) expectedObject, (JSONObject) actualObject);
    }
    if (expectedObject instanceof String) {
      return compareStrings((String) expectedObject, (String) actualObject);
    }
    if (expectedObject instanceof Number) {
      return compareNumbers((Number) expectedObject, (Number) actualObject);
    }
    return compareBooleans((Boolean) expectedObject, (Boolean) actualObject);
  }

  private boolean compareBooleans(Boolean expected, Boolean actual) {
    return expected.equals(actual);
  }

  private boolean compareNumbers(Number expected, Number actual) {
    double d1 = expected.doubleValue();
    double d2 = actual.doubleValue();
    if (Double.compare(d1, d2) == 0) {
      return true;
    }
    return (Math.abs(d1 - d2) <= 0.0000001);
  }

  private boolean compareStrings(String expected, String actual) {
    if (!strictTimezone) {
      // two instants with different timezones are considered as identical (2015-01-01T13:00:00+0100 and 2015-01-01T12:00:00+0000)
      Date expectedDate = tryParseDate(expected);
      Date actualDate = tryParseDate(actual);
      if (expectedDate != null && actualDate != null) {
        return expectedDate.getTime() == actualDate.getTime();
      }
    }
    return expected.equals(actual);
  }

  private boolean compareArrays(JSONArray expected, JSONArray actual) {
    if (strictArrayOrder) {
      return compareArraysByStrictOrder(expected, actual);
    }
    return compareArraysByLenientOrder(expected, actual);
  }

  private boolean compareArraysByStrictOrder(JSONArray expected, JSONArray actual) {
    if (expected.size() != actual.size()) {
      return false;
    }

    for (int index = 0; index < expected.size(); index++) {
      Object expectedElt = expected.get(index);
      Object actualElt = actual.get(index);
      if (!compare(expectedElt, actualElt)) {
        return false;
      }
    }
    return true;
  }

  private boolean compareArraysByLenientOrder(JSONArray expected, JSONArray actual) {
    if (expected.size() > actual.size()) {
      return false;
    }

    List remainingActual = new ArrayList(actual);
    for (Object expectedElement : expected) {
      // element can be null
      boolean found = false;
      for (Object actualElement : remainingActual) {
        if (compare(expectedElement, actualElement)) {
          found = true;
          remainingActual.remove(actualElement);
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
    if (!remainingActual.isEmpty()) {
      return false;
    }
    return true;
  }

  private boolean compareMaps(JSONObject expectedMap, JSONObject actualMap) {
    // each key-value of expected map must exist in actual map
    for (Object expectedKey : expectedMap.keySet()) {
      if (!actualMap.containsKey(expectedKey)) {
        return false;
      }
      if (!compare(expectedMap.get(expectedKey), actualMap.get(expectedKey))) {
        return false;
      }
    }
    return true;
  }

  @CheckForNull
  Date tryParseDate(String s) {
    try {
      return datetimeFormat.parse(s);
    } catch (ParseException ignored) {
      // not a datetime
      return null;
    }
  }
}
