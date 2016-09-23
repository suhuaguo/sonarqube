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
import keyBy from 'lodash/keyBy';
import { getFacets, getFacet } from '../../../api/issues';
import { getFavorites } from '../../../api/favorites';
import { receiveFavorites } from '../../../app/store/favorites/actions';
import { getMeasures } from '../../../api/measures';
import { receiveComponentMeasure } from '../../../app/store/measures/actions';

export const REQUEST_ISSUES_ACTIVITY = 'REQUEST_ISSUES_ACTIVITY';
export const RECEIVE_ISSUES_ACTIVITY = 'RECEIVE_ISSUES_ACTIVITY';
export const RECEIVE_ISSUES_BACKLOG = 'myActivity/RECEIVE_ISSUES_BACKLOG';

/**
 * @param {string} period
 * @returns {Object}
 */
const requestIssuesActivity = period => ({
  type: REQUEST_ISSUES_ACTIVITY,
  period
});

/**
 * @param {string} period
 * @param {number} total
 * @param {Array} facets
 * @returns {Object}
 */
const receiveIssuesActivity = (period, total, facets) => ({
  type: RECEIVE_ISSUES_ACTIVITY,
  period,
  total,
  facets
});

/**
 * @param {number} total
 * @param {Array} types
 * @returns {Object}
 */
const receiveIssuesBacklog = (total, types) => ({
  type: RECEIVE_ISSUES_BACKLOG,
  total,
  types
});

/**
 * @param {string} period
 * @returns {Promise}
 */
export const fetchIssuesActivity = period => dispatch => {
  const query = { resolved: 'false', assignees: '__me__' };
  if (period) {
    query.createdInLast = period;
    dispatch(requestIssuesActivity(period));
  }

  const facets = ['types', 'statuses', 'createdAt'];

  return getFacets(query, facets).then(data => {
    dispatch(receiveIssuesActivity(period, data.response.total, data.facets));
  });
};

/**
 * @returns {Promise}
 */
export const fetchIssuesBacklog = () => dispatch => {
  const query = { resolved: 'false', assignees: '__me__' };
  return getFacet(query, 'types').then(data => {
    dispatch(receiveIssuesBacklog(data.response.total, data.facet));
  });
};

export const fetchFavoriteProjects = () => dispatch => {
  getFavorites().then(favorites => {
    dispatch(receiveFavorites(favorites));

    const projects = favorites.filter(component => component.qualifier === 'TRK');
    Promise.all(projects.map(project => getMeasures(project.key, ['quality_gate_details'])))
        .then(responses => {
          responses.forEach((measures, index) => {
            measures.forEach(measure => {
              dispatch(receiveComponentMeasure(projects[index].key, measure.metric, measure.value));
            });
          });
        });
  });
};
