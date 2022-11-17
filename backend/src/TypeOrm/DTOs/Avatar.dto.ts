import { IsOptional } from "class-validator";

export class AvatarDTO {
    id: number;
    filename: string;
    data: string | ArrayBuffer;
    mimeType: string;
  }
