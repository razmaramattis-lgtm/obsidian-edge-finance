export interface Profile {
  id: string;
  name: string;
  role: string;
  active?: boolean;
  avatar_url?: string | null;
  email?: string;
  phone?: string | null;
  title?: string | null;
  department?: string | null;
  specialty?: string | null;
  interests?: string[];
  background_url?: string | null;
  bio?: string | null;
  preferred_accounting_systems?: string[];
}

export type View = "feed" | "groups" | "dms" | "conference" | "profile" | "friends" | "view-profile";

export interface Post {
  id: string;
  title?: string;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
  edited_at?: string | null;
  author_id: string;
  image_url?: string | null;
  profiles?: Profile;
}

export interface PostComment {
  id: string;
  content: string;
  created_at: string;
  edited_at?: string | null;
  author_id: string;
  profiles?: Profile;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_private: boolean;
  created_by: string;
  cover_image_url?: string | null;
}

export interface GroupMsg {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  file_url?: string | null;
  file_name?: string | null;
  profiles?: Profile;
}

export interface DmConv {
  id: string;
  participant_1: string;
  participant_2: string;
  other?: Profile;
}

export interface DmMsg {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  file_url?: string | null;
  file_name?: string | null;
}

export interface Friend {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  requester?: Profile;
  receiver?: Profile;
}

// View type moved to Profile section above
