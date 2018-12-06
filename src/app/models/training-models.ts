import { User } from './user-models';
import { IdTitleDesc } from './misc-models';

export class TrainingCourse {
    id?: number
    title?: string
    description?: string
    training_items?: TrainingItem[]
    training_course_completions?: TrainingCourseCompletion[]
    created_by?: User
    created_by_id?: number
    version?: number
    draft?: boolean
    badge?: MemberBadge
    badge_id?: number
}

export class TrainingItem {
    id?: number
    title?: string
    text?: string
    link?: string
    video_link?: string
    archived?: boolean
    training_item_completions?: TrainingItemCompletion[]
    training_item_type_id?: number
    training_item_type?: TrainingItemType
    created_by?: User
    created_by_id?: number
    training_course_id?: number
    ordinal: number
    version: number
}

export class TrainingItemCompletion {
    user_id?: number
    training_item_id?: number
    item_version?: number
    completed?: boolean
}

export class TrainingCourseCompletion {
    user_id?: number
    training_course_id?: number
    version?: number
}

export class TrainingItemType extends IdTitleDesc {

}

export class MemberBadge {
    id?: number
    title?: string
    image_link?: string
    ordinal?: number
    created_by?: User
    created_by_id?: number
    archived?: boolean
}
