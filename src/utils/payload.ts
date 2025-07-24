export type SignInPayloadType = {
  user_name: string;
  password: string;
  fcmToken: string | null;
};

export type SignUpPayloadType = {
  full_name?: string | null;
  email?: string | null;
  country_code?: string | null;
  phone_number?: string | null;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  pincode?: string | null;
  gender?: string | null;
  password?: string | null;
};
export type ResendInputPayloadType = {
  email: string | null | undefined
};
export type ChangePasswordPayloadType = {
  oldPassword: string | null | undefined,
  newPassword: string | null | undefined
};