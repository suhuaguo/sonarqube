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
import React from 'react';
import IssuesActivity from './IssuesActivity';
import IssuesBacklog from './IssuesBacklog';
import FavoriteProjects from './FavoriteProjects';
import FavoriteIssueFilters from './FavoriteIssueFilters';
import '../styles.css';

export default class MyActivity extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.object
  };

  componentDidMount () {
    document.querySelector('html').classList.add('dashboard-page');
  }

  componentWillUnmount () {
    document.querySelector('html').classList.remove('dashboard-page');
  }

  render () {
    const { currentUser } = this.props;

    return (
        <div id="my-activity-page" className="page page-limited">

          {currentUser == null ? (

              <div className="text-center">
                <i className="spinner"/>
              </div>

          ) : (

              <div className="my-activity-page clearfix">

                <div className="my-activity-left">
                  <IssuesActivity/>
                  <IssuesBacklog/>
                </div>

                <div className="my-activity-right">
                  <FavoriteProjects/>
                  <FavoriteIssueFilters/>
                </div>

              </div>

          )}

        </div>
    );
  }
}
