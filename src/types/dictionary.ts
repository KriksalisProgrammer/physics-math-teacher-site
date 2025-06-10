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

export interface AdminDictionary {
  dashboard: string;
  posts: string;
  news: string;
  lessons: string;
  comments: string;
  create_new: string;
  edit: string;
  delete: string;
  approve: string;
  reject: string;
  languages: AdminLanguagesDictionary;
  form: AdminFormDictionary;
  sidebar?: AdminSidebarDictionary;
  backToSite?: string;
  adminPanel?: string;
  [key: string]: string | AdminLanguagesDictionary | AdminFormDictionary | AdminSidebarDictionary | undefined;
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
  meetingError: string;
  [key: string]: string;
}

export interface Dictionary {
  common: CommonDictionary;
  auth: AuthDictionary;
  admin: AdminDictionary;
  blog: BlogDictionary;
  dashboard: DashboardDictionary;
  lessons: LessonsDictionary;
}
