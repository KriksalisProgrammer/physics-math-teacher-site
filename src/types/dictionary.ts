export interface CommonDictionary {
  site_title: string;
  welcome_title: string;
  welcome_message: string;
  home: string;
  blog: string;
  news: string;
  lessons: string;
  login: string;
  signup: string;
  logout: string;
  dashboard: string;
  admin: string;
  read_blog: string;
  explore_lessons: string;
  latest_posts: string;
  latest_news: string;
  view_all: string;
  no_posts_yet: string;
  no_news_yet: string;
  copyright: string;
  published_on: string;
  by: string;
  back_to_home: string;
  read_more: string;
  search: string;
  language: string;
  loading: string;
  error_fetching: string;
  back: string;
  [key: string]: string | undefined;
}

export interface AuthDictionary {
  login: string;
  signUp: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordsDoNotMatch: string;
  verifyEmail: string;
  signUpFailed: string;
  loginFailed: string;
  noAccount: string;
  alreadyHaveAccount: string;
  forgotPassword: string;
  [key: string]: string;
}

export interface AdminLanguagesDictionary {
  ukrainian: string;
  english: string;
  [key: string]: string;
}

export interface AdminFormDictionary {
  title?: string;
  content?: string;
  description?: string;
  save?: string;
  cancel?: string;
  saving?: string;
  create_post?: string;
  edit_post?: string;
  create_news?: string;
  edit_news?: string;
  create_lesson?: string;
  edit_lesson?: string;
  generate_room?: string;
  meetingLink?: string;
  [key: string]: string | undefined;
}

export interface AdminSidebarDictionary {
  dashboard: string;
  posts: string;
  news: string;
  lessons: string;
  comments: string;
  [key: string]: string;
}

export interface AdminCommentsDictionary {
  total: string;
  commentModeration?: string;
  commentModerationDescription?: string;
  all: string;
  pending: string;
  approved: string;
  rejected: string;
  commentOn: string;
  rating: string;
  moderate: string;
  bulkActions: string;
  selectAll: string;
  approveSelected: string;
  deleteSelected: string;
  [key: string]: string | undefined;
}

export interface AdminDictionary {
  dashboard: string;
  posts: string;
  news: string;
  lessons: string;
  commentsModeration: string;
  userManagement: string;
  analytics: string;
  settings: string;
  create_new: string;
  edit: string;
  delete: string;
  view: string;
  publish: string;
  unpublish: string;
  archive: string;
  restore: string;
  duplicate: string;
  export: string;
  import: string;
  approve: string;
  reject: string;
  languages: AdminLanguagesDictionary;
  form: AdminFormDictionary;
  sidebar?: AdminSidebarDictionary;
  commentsDetails?: AdminCommentsDictionary;
  backToSite?: string;
  adminPanel?: string;
  [key: string]: string | AdminLanguagesDictionary | AdminFormDictionary | AdminSidebarDictionary | AdminCommentsDictionary | undefined;
}

export interface BlogDictionary {
  title: string;
  comments: string;
  leave_comment: string;
  submit_comment: string;
  comment_placeholder: string;
  your_rating: string;
  average_rating: string;
  no_comments: string;
  comment_submitted: string;
  comment_error: string;
  back_to_blog?: string;
  [key: string]: string | undefined;
}

export interface DashboardDictionary {
  title: string;
  welcome: string;
  my_lessons: string;
  upcoming_lessons: string;
  completed_lessons: string;
  no_lessons: string;
  profile: string;
  edit_profile: string;
  settings: string;
  noUpcomingLessons?: string;
  editProfile?: string;
  [key: string]: string | undefined;
}

export interface LessonsDictionary {
  title: string;
  scheduled_for: string;
  join_lesson: string;
  lesson_description: string;
  no_lessons: string;
  lesson_completed: string;
  upcoming_lesson: string;
  jitsiError: string;
  jitsiLoadError: string;
  meetingError: string;  [key: string]: string;
}

export interface ProfileDictionary {
  title: string;
  personalInfo: string;
  editProfile: string;
  saveChanges: string;
  cancel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  profileUpdated: string;
  errorUpdating: string;  [key: string]: string;
}

export interface NavigationDictionary {
  home: string;
  lessons: string;
  blog: string;
  news: string;
  dashboard: string;
  [key: string]: string;
}

export interface ApplicationsDictionary {
  title: string;
  page_title: string;
  page_description: string;
  subtitle: string;
  subject: string;
  lesson_type: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  contact_method: string;
  phone: string;
  telegram: string;
  message: string;
  message_placeholder: string;
  select_subject: string;
  select_type: string;
  mathematics: string;
  physics: string;
  chemistry: string;
  english: string;
  ukrainian: string;
  programming: string;
  individual: string;
  group: string;
  consultation: string;
  preparation: string;
  duration_30: string;
  duration_60: string;
  duration_90: string;
  duration_120: string;
  submit: string;
  submitting: string;
  submit_another: string;
  success_title: string;
  success_message: string;
  error: string;
  feature_1_title: string;
  feature_1_desc: string;
  feature_2_title: string;
  feature_2_desc: string;
  feature_3_title: string;
  feature_3_desc: string;
  [key: string]: string;
}

export interface Dictionary {
  common: CommonDictionary;
  auth: AuthDictionary;
  admin: AdminDictionary;
  blog: BlogDictionary;
  dashboard: DashboardDictionary;
  lessons: LessonsDictionary;
  navigation: NavigationDictionary;
  profile: ProfileDictionary;
  applications: ApplicationsDictionary;
}
