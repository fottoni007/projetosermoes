export type PastorProfile = {
  id: string;
  user_id: string;
  full_name: string;
  church_name: string;
  address: string;
  years_of_ministry: number;
  pastor_type: "senior" | "colaborador";
  academic_background: string;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  phone_country_code: string;
  phone_number: string;
  contact_email: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  auto_approve_revoked: boolean;
  created_at: string;
  updated_at: string;
};

export type PastorProfileFormState = {
  message: string;
  success?: boolean;
  errors?: Record<string, string[]>;
};
