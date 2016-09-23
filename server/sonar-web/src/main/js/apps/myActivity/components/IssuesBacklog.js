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
import { fetchIssuesBacklog } from '../store/actions';
import { getBacklog } from '../../../app/store/rootReducer';
import { formatMeasure } from '../../../helpers/measures';
import { translate } from '../../../helpers/l10n';
import { getIssuesUrl } from '../../../helpers/urls';

class IssuesBacklog extends React.Component {
  static propTypes = {
    backlog: React.PropTypes.object.isRequired,
    fetchIssuesBacklog: React.PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.fetchIssuesBacklog();
  }

  renderTotal () {
    const { total } = this.props.backlog;

    const url = getIssuesUrl({ resolved: 'false', assignees: '__me__' });

    return (
        <div className="issues-activity-total">
          <div className="issues-activity-number">
            {total > 0 ? (
                <a className="text-danger" href={url}>
                  {formatMeasure(total, 'SHORT_INT')}
                </a>
            ) : (
                <span className="text-success">
                  {formatMeasure(total, 'SHORT_INT')}
                </span>
            )}
          </div>
          <div className="issues-activity-note">
            {translate('my_activity.unresolved_issues')}
          </div>
        </div>
    );
  }

  renderType (number, type) {
    const url = getIssuesUrl({
      resolved: 'false',
      assignees: '__me__',
      types: type
    });

    return (
        <div className="issues-activity-types-item">
          <div className="issues-activity-number">
            {number > 0 ? (
                <a className="text-danger" href={url}>
                  {formatMeasure(number, 'SHORT_INT')}
                </a>
            ) : (
                <span className="text-success">
                  {formatMeasure(number, 'SHORT_INT')}
                </span>
            )}
          </div>
          <div className="issues-activity-note">
            {translate('issue.type', type, 'plural')}
          </div>
        </div>
    );
  }

  renderTypes () {
    const types = this.props.backlog.types;

    return (
        <div className="issues-activity-types">
          {this.renderType(types['BUG'], 'BUG')}
          {this.renderType(types['VULNERABILITY'], 'VULNERABILITY')}
          {this.renderType(types['CODE_SMELL'], 'CODE_SMELL')}
        </div>
    );
  }

  renderInner () {
    if (this.props.backlog.total == null) {
      return null;
    }

    return (
        <div className="boxed-group-inner">
          <div className="issues-activity clearfix">
            {this.renderTotal()}
            {this.renderTypes()}
          </div>
        </div>
    );
  }

  render () {
    return (
        <div className="boxed-group">
          <div className="boxed-group-actions">
            <span className="note">{translate('my_activity.all_time')}</span>
          </div>
          {this.renderInner()}
        </div>
    );
  }
}

export default connect(
    state => ({
      backlog: getBacklog(state)
    }),
    { fetchIssuesBacklog }
)(IssuesBacklog);
