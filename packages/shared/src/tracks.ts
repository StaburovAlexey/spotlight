import type { MultipartFile } from "@fastify/multipart";
export interface TrackUploadRequest  {
    file: MultipartFile
}
export interface TrackUploadDebugDto  {
    filename: string,
    mimetype: string,
    encoding: string

}