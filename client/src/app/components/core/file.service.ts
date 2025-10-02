import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { FileControllerService, FileLinkDTO } from '../../api/index';

@Injectable({
              providedIn: 'root',
            })
export class FileService {

  constructor(public backend: FileControllerService) {
  }

  upload(form: any): Promise<number> {
    return lastValueFrom(this.backend.upload(form));
  }

  link(dto: FileLinkDTO) {
    return lastValueFrom(this.backend.linkFile(dto));
  }

  download(id: number): Observable<string> {
    return this.backend.download(id).pipe(map(file => `data:${file.contentType};base64,${file.base64Data}`));
  }

}
