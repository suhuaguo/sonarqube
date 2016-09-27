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
import UserExternalIdentity from './UserExternalIdentity';
import UserGroups from './UserGroups';
import UserScmAccounts from './UserScmAccounts';
import Avatar from '../../../components/ui/Avatar';

export default class UserCard extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
  };

  render () {
    const { user } = this.props;

    return (
        <div className="boxed-group boxed-group-inner">
          <div className="clearfix">
            <div id="avatar" className="account-nav-avatar">
              <Avatar email={user.email} size={48}/>
            </div>
            <div>
              <h1 id="name" className="display-inline-block">{user.name}</h1>
              <span id="login" className="note big-spacer-left">{user.login}</span>
              {!user.local && user.externalProvider !== 'sonarqube' && (
                  <span id="identity-provider" className="big-spacer-left">
                <UserExternalIdentity user={user}/>
              </span>
              )}
            </div>
            <div id="email" className="little-spacer-top">{user.email}</div>
          </div>
          <hr/>
          <UserGroups groups={user.groups}/>
          <hr/>
          <UserScmAccounts user={user} scmAccounts={user.scmAccounts}/>
        </div>
    );
  }
}
