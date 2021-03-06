import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRoutes } from '../../../shared/routes/user.routes';
import { UserPublicViewModel } from '../../../shared/view-models/user/user-public.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    getUserPublic(userId: number, pageIndex: number, pageSize?: number): Observable<UserPublicViewModel | null> {
        return this.http
            .get<UserPublicViewModel>(`${environment.httpDomain}${UserRoutes.getUserPublic(userId).client({ pageIndex, pageSize })}`);
    }
}
