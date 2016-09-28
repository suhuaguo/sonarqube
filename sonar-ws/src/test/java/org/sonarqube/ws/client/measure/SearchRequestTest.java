/*
 * SonarQube
 * Copyright (C) 2009-2016 SonarSource SA
 * mailto:contact AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

package org.sonarqube.ws.client.measure;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;

public class SearchRequestTest {

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  SearchRequest.Builder underTest = SearchRequest.builder();

  @Test
  public void with_component_ids() {
    SearchRequest result = underTest
      .setMetricKeys(singletonList("metric"))
      .setComponentIds(singletonList("uuid"))
      .build();

    assertThat(result.getMetricKeys()).containsExactly("metric");
    assertThat(result.getComponentIds()).containsExactly("uuid");
    assertThat(result.hasComponentKeys()).isFalse();
  }

  @Test
  public void with_component_keys() {
    SearchRequest result = underTest
      .setMetricKeys(singletonList("metric"))
      .setComponentKeys(singletonList("key"))
      .build();

    assertThat(result.getMetricKeys()).containsExactly("metric");
    assertThat(result.getComponentKeys()).containsExactly("key");
    assertThat(result.hasComponentIds()).isFalse();
  }

  @Test
  public void fail_when_non_null_metric_keys() {
    expectExceptionOnMetricKeys();

    underTest.setMetricKeys(null).build();
  }

  @Test
  public void fail_when_non_empty_metric_keys() {
    expectExceptionOnMetricKeys();

    underTest.setMetricKeys(emptyList()).build();
  }

  @Test
  public void fail_when_unset_metric_keys() {
    expectExceptionOnMetricKeys();

    underTest.build();
  }

  @Test
  public void fail_when_component_ids_and_keys_provided() {
    expectExceptionOnComponents();

    underTest
      .setMetricKeys(singletonList("metric"))
      .setComponentIds(singletonList("uuid"))
      .setComponentKeys(singletonList("key"))
      .build();
  }

  @Test
  public void fail_when_component_ids_is_empty() {
    expectExceptionOnComponents();

    underTest
      .setMetricKeys(singletonList("metric"))
      .setComponentIds(emptyList())
      .build();
  }

  @Test
  public void fail_when_component_keys_is_empty() {
    expectExceptionOnComponents();

    underTest
      .setMetricKeys(singletonList("metric"))
      .setComponentKeys(emptyList())
      .build();
  }

  private void expectExceptionOnMetricKeys() {
    expectedException.expect(IllegalArgumentException.class);
    expectedException.expectMessage("Metric keys must be provided");
  }

  private void expectExceptionOnComponents() {
    expectedException.expect(IllegalArgumentException.class);
    expectedException.expectMessage("Either component ids or component keys must be provided, not both.");
  }
}
