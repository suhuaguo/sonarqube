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
import shallowCompare from 'react-addons-shallow-compare';
import sortBy from 'lodash/sortBy';
import { DrilldownLink } from '../../../components/shared/drilldown-link';
import Level from '../../../components/ui/Level';
import { translate } from '../../../helpers/l10n';

export default class QualityGate extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    details: React.PropTypes.string.isRequired
  };

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render () {
    const parsed = JSON.parse(this.props.details);

    if (parsed.level === 'OK') {
      return (
          <div className="spacer-top">
            <Level level={parsed.level}/>
          </div>
      );
    }

    const conditions = sortBy(
        parsed.conditions.filter(condition => condition.level !== 'OK'),
        condition => ['ERROR', 'WARN'].indexOf(condition.level),
        condition => translate('metric', condition.metric, 'name')
    );

    return (
        <div className="spacer-top clearfix">
          {conditions.map(condition => (
              <div key={condition.metric} className="pull-left spacer-right">
                <DrilldownLink component={this.props.project.key} metric={condition.metric}>
                  <span className={'level level-' + condition.level}>
                    {translate('metric', condition.metric, 'name')}
                  </span>
                </DrilldownLink>
              </div>
          ))}
        </div>
    );
  }
}
