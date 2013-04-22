/*
 * SonarQube, open source software quality management tool.
 * Copyright (C) 2008-2013 SonarSource
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
package org.sonar.core.issue.workflow;

import org.junit.Test;
import org.sonar.api.issue.Issue;
import org.sonar.core.issue.DefaultIssue;

import static org.fest.assertions.Assertions.assertThat;

public class SetResolutionTest {
  @Test
  public void should_set_resolution() throws Exception {
    DefaultIssue issue = new DefaultIssue();
    SetResolution function = new SetResolution(Issue.RESOLUTION_FIXED);
    function.execute(issue);
    assertThat(issue.resolution()).isEqualTo(Issue.RESOLUTION_FIXED);
  }

  @Test
  public void resolution_should_not_be_empty() throws Exception {
    try {
      new SetResolution("");
    } catch (IllegalArgumentException e) {
      assertThat(e).hasMessage("Resolution must be set");
    }
  }
}
