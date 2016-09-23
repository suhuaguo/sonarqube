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
import classNames from 'classnames';
import RadioToggle from '../../../components/controls/RadioToggle';
import { BarChart } from '../../../components/charts/bar-chart';
import { fetchIssuesActivity } from '../store/actions';
import { getIssuesActivity } from '../../../app/store/rootReducer';
import { formatMeasure } from '../../../helpers/measures';
import { getIssuesUrl } from '../../../helpers/urls';
import { translate } from '../../../helpers/l10n';

class IssuesActivity extends React.Component {
  static propTypes = {
    fetchIssuesActivity: React.PropTypes.func.isRequired
  };

  handleChangePeriod = value => {
    this.props.fetchIssuesActivity(value);
  };

  componentDidMount () {
    this.props.fetchIssuesActivity('1w');
  }

  renderPeriodSelect () {
    const { issuesActivity } = this.props;

    if (issuesActivity.period == null) {
      return null;
    }

    const options = [
      { label: translate('issues.facet.createdAt.last_week'), value: '1w' },
      { label: translate('issues.facet.createdAt.last_month'), value: '1m' },
      { label: translate('issues.facet.createdAt.last_year'), value: '1y' }
    ];

    return (
        <div className="boxed-group-actions">
          <RadioToggle
              options={options}
              value={issuesActivity.period}
              name="activity-period"
              onCheck={this.handleChangePeriod}/>
        </div>
    );
  }

  renderTrend () {
    const { createdAt } = this.props.issuesActivity;
    const data = createdAt.map((point, index) => ({ x: index, y: point.count }));
    return (
        <div className="issues-activity-chart" style={{ width: 80, height: 32 }}>
          <BarChart data={data} barsWidth={2} padding={[0, 0, 0, 0]}/>
        </div>
    );
  }

  renderTotal () {
    const { total, period } = this.props.issuesActivity;

    const url = getIssuesUrl({
      resolved: 'false',
      assignees: '__me__',
      createdInLast: period
    });

    return (
        <div className="issues-activity-total">
          <div className="issues-activity-number">
            {total == null ? (
                <span><i className="spinner"/></span>
            ) : (
                total > 0 ? (
                    <a className="text-danger" href={url}>
                      {formatMeasure(total, 'SHORT_INT')}
                    </a>
                ) : (
                    <span className="text-success">
                      {formatMeasure(total, 'SHORT_INT')}
                    </span>
                )
            )}
          </div>
          {!!total && this.renderTrend()}
          <div className="issues-activity-note">
            {translate('my_activity.new_unresolved_issues')}
          </div>
        </div>
    );
  }

  renderToReview () {
    const { total, statuses, period } = this.props.issuesActivity;

    if (!total) {
      return null;
    }

    const toReview = statuses['OPEN'] + statuses['REOPENED'];

    const url = getIssuesUrl({
      resolved: 'false',
      assignees: '__me__',
      createdInLast: period,
      statuses: 'OPEN,REOPENED'
    });

    return (
        <div className="issues-activity-total">
          <div className="issues-activity-number">
            {toReview > 0 ? (
                <a className="text-danger" href={url}>
                  {formatMeasure(toReview, 'SHORT_INT')}
                </a>
            ) : (
                <span className="text-success">
                  {formatMeasure(toReview, 'SHORT_INT')}
                </span>
            )}
          </div>
          <div className="issues-activity-note">
            {translate('my_activity.to_review')}
          </div>
        </div>
    );
  }

  renderType (number, type) {
    const url = getIssuesUrl({
      resolved: 'false',
      assignees: '__me__',
      createdInLast: this.props.issuesActivity.period,
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
    const { total, types } = this.props.issuesActivity;

    if (!total) {
      return null;
    }

    return (
        <div className="issues-activity-types">
          {this.renderType(types['BUG'], 'BUG')}
          {this.renderType(types['VULNERABILITY'], 'VULNERABILITY')}
          {this.renderType(types['CODE_SMELL'], 'CODE_SMELL')}
        </div>
    );
  }

  render () {
    const isGood = this.props.issuesActivity.total != null && this.props.issuesActivity.total === 0;
    const className = classNames('boxed-group', { 'boxed-group-success': isGood });

    return (
        <div className={className}>
          {this.renderPeriodSelect()}

          <h2>{translate('my_activity.issues_activity')}</h2>

          <div className="boxed-group-inner">
            <div className="issues-activity clearfix">
              {this.renderTotal()}
              {this.renderToReview()}
              {this.renderTypes()}
            </div>
          </div>
        </div>
    );
  }
}

export default connect(
    state => ({ issuesActivity: getIssuesActivity(state) }),
    { fetchIssuesActivity }
)(IssuesActivity);
