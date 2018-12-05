import { User } from './user-models';

export class TrainingCourse {
    id?: number
    title?: string
    description?: string
    training_items?: TrainingItem[]
    training_course_completions: TrainingCourseCompletion[]
}

export class TrainingItem {
    id?: number
    title?: string
    text?: string
    link?: string
    video_link?: string
    archived?: boolean
    training_item_completions?: TrainingItemCompletion[]
    created_by?: User
    created_by_id?: number
}

export class TrainingItemCompletion {
    user_id?: number
    training_item_id?: number
}

export class TrainingCourseCompletion {
    user_id?: number
    training_course_id?: number
}
