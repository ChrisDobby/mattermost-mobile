// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {realmConnect} from 'realm-react-redux';

import {General} from 'app/constants';
import {handleTeamChangeAndSwitchToInitialChannel} from 'app/realm/actions/team';
import {getTeamsFromResult} from 'app/realm/selectors/team';
import options from 'app/store/realm_options';

import TeamsList from './teams_list';

function mapPropsToQueries(realm) {
    const general = realm.objectForPrimaryKey('General', General.REALM_SCHEMA_ID);
    const user = realm.objectForPrimaryKey('User', general.currentUserId);
    const openTeams = realm.objects('Team').filtered('allowOpenInvites=true AND deleteAt=0 AND members.user.id != $0', user.id);
    const myTeams = realm.objects('Team').filtered('members.user.id=$0 AND deleteAt=0', user.id).sorted('displayName');
    return [general, myTeams, openTeams];
}

function mapQueriesToProps([general, myTeams, openTeams]) {
    return {
        currentTeamId: general?.currentTeamId,
        hasOtherJoinableTeams: !openTeams.isEmpty(),
        teams: getTeamsFromResult(myTeams),
    };
}

const mapRealmDispatchToProps = {
    handleTeamChangeAndSwitchToInitialChannel,
};

export default realmConnect(mapPropsToQueries, mapQueriesToProps, mapRealmDispatchToProps, null, options)(TeamsList);
