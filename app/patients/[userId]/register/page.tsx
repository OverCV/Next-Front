// app\patients\[userId]\register\page.tsx
import Image from "next/image";
import { redirect } from "next/navigation";

import RegistroForm from "@/src/components/forms/RegistroForm";

import { getPatient, getUser } from "@/src/lib/actions/patient.actionsions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);

  if (patient) redirect(`/patients/${userId}/new-appointment`);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/brand/logo-white.ico"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <RegistroForm user={user} />

          <p className="copyright py-12">© 2025 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
