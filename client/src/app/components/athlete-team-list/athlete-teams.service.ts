import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AthleteControllerService } from '../../api/index';
import { AthleteTeamModel } from '../../models/athlete-team.model';
import { MemberInfoModel } from '../../models/member-info.model';

@Injectable({
              providedIn: 'root',
            })
export class AthleteTeamsService {

  constructor(public backend: AthleteControllerService) {
  }

  getTeams(): Observable<AthleteTeamModel[]> {
    return this.backend.getAllAthleteTeams().pipe(
      map(items => items.map(item => AthleteTeamModel.fromDTO(item))),
    );
  }

  createTeam(model: AthleteTeamModel): Promise<number> {
    return lastValueFrom(this.backend.createAthleteTeam(model.toDTO()));
  }

  editTeam(model: AthleteTeamModel): Promise<number> {
    return lastValueFrom(this.backend.updateAthleteTeam(model.id!, model.toDTO()));
  }

  getTeamById(id: number): Observable<AthleteTeamModel> {
    return this.backend.getAthleteTeamById(id).pipe(
      map(item => AthleteTeamModel.fromDTO(item)),
    );
  }

  addTeamMember(model: AthleteTeamModel, member: MemberInfoModel) {
    return lastValueFrom(this.backend.addAthleteTeamMember(model.id!, member.toDTO()));
  }

  deleteTeamMember(model: AthleteTeamModel, member: MemberInfoModel) {
    return lastValueFrom(this.backend.deleteAthleteTeamMember(model.id!, member.toDTO()));
  }
}
