import { IsOptional } from "class-validator";

export class AvatarDTO {
    @IsOptional()
    id: number;
  
    filename: string;
    data: string | ArrayBuffer;
    mimeType: string;
  }
