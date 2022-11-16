import { IsOptional } from "class-validator";

export class AvatarDTO {
    @IsOptional()
    id: number;
  
    name: string;
    data: string | ArrayBuffer;
    mimeType: string;
  }
