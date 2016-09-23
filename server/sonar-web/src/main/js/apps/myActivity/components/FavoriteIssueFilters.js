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
import { connect } from 'react-redux';
import sortBy from 'lodash/sortBy';
import { getFavoriteIssueFilters } from '../../../app/store/rootReducer';
import { fetchIssueFilters } from '../../../app/store/issueFilters/actions';
import { getIssuesUrl } from '../../../helpers/urls';
import { translate } from '../../../helpers/l10n';

class FavoriteIssueFilters extends React.Component {
  static propTypes = {
    issueFilters: React.PropTypes.array.isRequired,
    fetchIssueFilters: React.PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.fetchIssueFilters();
  }

  render () {
    if (this.props.issueFilters.length === 0) {
      return null;
    }

    const sortedFilters = sortBy(this.props.issueFilters, filter => filter.name.toLowerCase());

    return (
        <div className="boxed-group">
          <h2>{translate('my_activity.favorite_issue_filters')}</h2>
          <div className="boxed-group-inner">
            <ul className="boxed-group-list">
              {sortedFilters.map(filter => (
                  <li key={filter.id}>
                    <a href={getIssuesUrl({ id: filter.id })}>{filter.name}</a>
                  </li>
              ))}
            </ul>
          </div>
        </div>
    );
  }
}

export default connect(
    state => ({
      issueFilters: getFavoriteIssueFilters(state)
    }),
    { fetchIssueFilters }
)(FavoriteIssueFilters);
