export type StatutLecture = "WISHLIST" | "OWNED" | "READING" | "READ";

export type EntreeCollection = {
  mangaId: number;
  statut: StatutLecture;
  updatedAt: number;
};

export type Avis = {
  mangaId: number;
  note: number; // 0..5
  commentaire?: string;
  updatedAt: number;
};

export type UserLite = {
  id: string;
  username: string;
  email: string;
};