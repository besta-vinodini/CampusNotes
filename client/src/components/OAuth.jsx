// import React from "react";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "../firebase";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "../redux/user/userSlice";
// import { useNavigate } from "react-router-dom";

// const OAuth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handeleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);

//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/auth/google`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({
//             name: result.user.displayName,
//             email: result.user.email,
//             photo: result.user.photoURL,
//           }),
//         }
//       );
//       const data = await res.json();

//       dispatch(signInSuccess(data));
//       navigate("/");
//     } catch (error) {
//       console.log("could not sign in with google", error);
//     }
//   };
//   return (
//     <button
//       onClick={handeleGoogleClick}
//       type="button"
//       className=" cursor-pointer w-full bg-indigo-900 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//     >
//       Continue with Google
//     </button>
//   );
// };

// export default OAuth;
