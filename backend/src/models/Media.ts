import mongoose, { Schema } from 'mongoose';

export type MediaStatus =
  | 'uploaded_pending_analysis'
  | 'analyzing'
  | 'done'
  | 'failed';

export interface MediaDoc extends mongoose.Document {
  key: string;                  // S3 object key
  bucket: string;               // S3 bucket
  type: 'image' | 'video';
  status: MediaStatus;
  meta?: any;                   // AI analysis result
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<MediaDoc>(
  {
    key: { type: String, required: true, index: true, unique: true },
    bucket: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    status: {
      type: String,
      enum: ['uploaded_pending_analysis', 'analyzing', 'done', 'failed'],
      default: 'uploaded_pending_analysis'
    },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Media = mongoose.models.Media || mongoose.model<MediaDoc>('Media', MediaSchema);
