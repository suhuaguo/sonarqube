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
import QualityGate from './QualityGate';
import { getFavorites, getComponentMeasure } from '../../../app/store/rootReducer';
import { getComponentUrl } from '../../../helpers/urls';
import { fetchFavoriteProjects } from '../store/actions';
import { translate } from '../../../helpers/l10n';

class FavoriteProjects extends React.Component {
  static propTypes = {
    fetchFavoriteProjects: React.PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.fetchFavoriteProjects();
  }

  render () {
    const { favorites } = this.props;

    const sorted = sortBy(favorites, project => project.name.toLowerCase());

    return (
        <div className="boxed-group">
          <h2>{translate('my_activity.favorite_projects')}</h2>

          <div className="boxed-group-inner">
            {sorted.length > 0 && (
                <ul className="boxed-group-list boxed-group-list-spread">
                  {sorted.map(project => (
                      <li key={project.key} className="clearfix">
                        <a href={getComponentUrl(project.key)}>
                          <strong>{project.name}</strong>
                        </a>

                        {project.qualityGate != null && (
                            <QualityGate project={project} details={project.qualityGate}/>
                        )}
                      </li>
                  ))}
                </ul>
            )}
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  favorites: getFavorites(state)
      .filter(component => component.qualifier === 'TRK')
      .map(component => ({
        ...component,
        qualityGate: getComponentMeasure(state, component.key, 'quality_gate_details')
      }))
});

export default connect(
    mapStateToProps,
    { fetchFavoriteProjects }
)(FavoriteProjects);
