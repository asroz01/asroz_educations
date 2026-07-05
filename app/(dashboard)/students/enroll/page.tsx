import { redirect } from "next/navigation";

// /students/enroll redirects to /students with the modal triggered via URL
// The AddStudentModal is opened client-side; deep-linking here lands on the table
export default function EnrollRedirectPage() {
  redirect("/students");
}
