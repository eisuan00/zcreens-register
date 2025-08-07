import mongoose, { Document, Schema } from 'mongoose';

export interface ISlide {
  pageNumber: number;
  image: string;
  width: number;
  height: number;
}

export interface IPresentation extends Document {
  id: string;
  screenCode: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  slides: ISlide[];
  totalSlides: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
}

const SlideSchema = new Schema<ISlide>({
  pageNumber: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 1920,
  },
  height: {
    type: Number,
    default: 1080,
  },
});

const PresentationSchema = new Schema<IPresentation>({
  screenCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  slides: [SlideSchema],
  totalSlides: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
}, {
  timestamps: true,
});

// Index for automatic deletion of expired presentations
PresentationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups by screen code
PresentationSchema.index({ screenCode: 1 });

// Index for user presentations
PresentationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Presentation || mongoose.model<IPresentation>('Presentation', PresentationSchema);
