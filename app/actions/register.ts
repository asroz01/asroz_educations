"use server";

import { createClient } from "@/utils/supabase/server";

// ── Upload a file to registration-docs bucket ─────────────────
async function uploadDoc(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File,
  label: string
): Promise<string | null> {
  const ext  = file.name.split(".").pop();
  const path = `${userId}/${label}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("registration-docs")
    .upload(path, file, { upsert: true });
  if (error) { console.error("upload error", error); return null; }
  return path;
}

// ── Teacher registration ──────────────────────────────────────
export async function registerTeacher(formData: FormData) {
  const supabase = await createClient();

  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  // 1. Create auth user (email confirmation = OTP via Supabase magic link)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "teacher" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard`,
    },
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Registration failed" };
  }

  const userId = authData.user.id;

  // 2. Upload NIC images
  const nicFrontFile = formData.get("nic_front") as File | null;
  const nicBackFile  = formData.get("nic_back")  as File | null;
  const nicFrontUrl  = nicFrontFile?.size ? await uploadDoc(supabase, userId, nicFrontFile, "nic-front") : null;
  const nicBackUrl   = nicBackFile?.size  ? await uploadDoc(supabase, userId, nicBackFile,  "nic-back")  : null;

  // 3. Upsert extended profile (is_approved = false by default)
  const { error: profileError } = await supabase.from("profiles").upsert({
    id:                      userId,
    full_name:               fullName,
    role:                    "teacher",
    is_approved:             false,
    username:                formData.get("username")               as string,
    mobile:                  formData.get("mobile")                 as string,
    address:                 formData.get("address")                as string,
    education_qualification: formData.get("education_qualification") as string,
    current_company:         formData.get("current_company")        as string,
    nic_number:              formData.get("nic_number")             as string,
    nic_front_url:           nicFrontUrl,
    nic_back_url:            nicBackUrl,
    experience_years:        Number(formData.get("experience_years") ?? 0),
  });

  if (profileError) return { error: profileError.message };
  return { success: true };
}

// ── Student registration ──────────────────────────────────────
export async function registerStudent(formData: FormData) {
  const supabase = await createClient();

  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "student" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/dashboard`,
    },
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Registration failed" };
  }

  const userId = authData.user.id;

  // Upload document image
  const docFile  = formData.get("document_image") as File | null;
  const docUrl   = docFile?.size ? await uploadDoc(supabase, userId, docFile, "document") : null;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id:               userId,
    full_name:        fullName,
    role:             "student",
    is_approved:      false,
    username:         formData.get("username")       as string,
    mobile:           formData.get("mobile")         as string,
    date_of_birth:    formData.get("date_of_birth")  as string,
    gender:           formData.get("gender")         as string,
    school_name:      formData.get("school_name")    as string,
    document_type:    formData.get("document_type")  as string,
    document_number:  formData.get("document_number") as string,
    document_url:     docUrl,
    father_name:      formData.get("father_name")    as string,
    father_mobile:    formData.get("father_mobile")  as string,
    father_occupation:formData.get("father_occupation") as string,
    father_age:       Number(formData.get("father_age") ?? 0),
    mother_name:      formData.get("mother_name")    as string,
    mother_mobile:    formData.get("mother_mobile")  as string,
  });

  if (profileError) return { error: profileError.message };
  return { success: true };
}

// ── Admin: approve or reject a user ──────────────────────────
export async function approveUser(userId: string, approve: boolean, reason?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("profiles").update({
    is_approved:      approve,
    approved_by:      approve ? user.id : null,
    approved_at:      approve ? new Date().toISOString() : null,
    rejection_reason: approve ? null : (reason ?? "Not approved"),
  }).eq("id", userId);

  if (error) return { error: error.message };
  return { success: true };
}
