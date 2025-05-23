// // app\patients\[userId]\new-appointment\page.tsx

// import Image from "next/image";

// import { AppointmentForm } from "@/src/components/forms/AppointmentForm";

// import { getPatient } from "@/src/lib/actions/patient.actionsions";

// const Appointment = async ({ params: { userId } }: SearchParamProps) => {
//   const patient = await getPatient(userId);

//   return (
//     <div className="flex h-screen max-h-screen">
//       <section className="remove-scrollbar container my-auto">
//         <div className="sub-container max-w-[860px] flex-1 justify-between">
//           <Image
//             src="/assets/brand/logo-black.ico"
//             height={1000}
//             width={1000}
//             alt="logo"
//             className="mb-12 h-10 w-fit"
//           />

//           <AppointmentForm
//             patientId={patient?.$id}
//             userId={userId}
//             type="create"
//           />

//           <p className="copyright mt-10 py-12">© 2025 CarePluse</p>
//         </div>
//       </section>

//       <Image
//         src="/assets/images/appointment-img.png"
//         height={1500}
//         width={1500}
//         alt="appointment"
//         className="side-img max-w-[390px] bg-bottom"
//       />
//     </div>
//   );
// };

// export default Appointment;
