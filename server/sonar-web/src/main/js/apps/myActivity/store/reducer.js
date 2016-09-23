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
import { combineReducers } from 'redux';
import keyBy from 'lodash/keyBy';
import { REQUEST_ISSUES_ACTIVITY, RECEIVE_ISSUES_ACTIVITY, RECEIVE_ISSUES_BACKLOG } from './actions';

const normalizeFacet = facet => {
  const byValue = keyBy(facet, 'val');
  Object.keys(byValue).forEach(value => byValue[value] = byValue[value].count);
  return byValue;
};

const period = (state = null, action = {}) => (
    action.type === REQUEST_ISSUES_ACTIVITY ?
        action.period :
        state
);

const activityByPeriod = (state = {}, action = {}) => {
  if (action.type === RECEIVE_ISSUES_ACTIVITY) {
    const facetsByProperty = keyBy(action.facets, 'property');
    const types = normalizeFacet(facetsByProperty.types.values);
    const statuses = normalizeFacet(facetsByProperty.statuses.values);
    const createdAt = facetsByProperty.createdAt.values;
    const chunk = { total: action.total, types, statuses, createdAt };
    return { ...state, [action.period]: chunk };
  }

  return state;
};

const backlog = (state = {}, action = {}) => {
  if (action.type === RECEIVE_ISSUES_BACKLOG) {
    const types = normalizeFacet(action.types);
    return { total: action.total, types };
  }

  return state;
};

export default combineReducers({ period, activityByPeriod, backlog });

export const getIssuesActivity = state => ({
  period: state.period,
  ...state.activityByPeriod[state.period]
});

export const getBacklog = state => (
    state.backlog
);
