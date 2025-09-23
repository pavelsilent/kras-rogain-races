// import { ResourceDTO } from '../api/index';

export type ResourceName = 'race' | 'race-type' | 'city' | 'athlete' | 'club';

export class Resource {

  id: string;

  resourceName: ResourceName;

  name: string;

  code: string;

  description: string;

  // constructor(dto?: ResourceDTO) {
  //   if (exists(dto)) {
  //     this.id = dto.id!;
  //     this.resourceName = dto.resourceName as ResourceName;
  //     this.code = dto.code!;
  //     this.name = dto.name!;
  //     this.description = dto.description!;
  //   }
  // }
  //
  // static fromDTO(dto ?: ResourceDTO): Resource {
  //   return new Resource(dto);
  // }

  // toDTO(): ResourceDTO {
  //   return {
  //     id: this.id,
  //     resourceName: this.resourceName,
  //     code: this.code,
  //     name: this.name,
  //     description: this.description,
  //   };
  // }


}
