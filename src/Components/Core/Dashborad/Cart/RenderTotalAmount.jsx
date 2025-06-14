// import React from 'react'
// import { useSelector } from 'react-redux'
// import IconBtn from '../../../common/IconBtn';

// const RenderTotalAmount = () => {

//     const {total, cart} = useSelector((state) => state.cart);

//     const handleBuyCourse = () => {
//         const courses = cart.map((course) => course._id);
//         console.log("Bought these course:", courses);
//         //TODO: API integrate -> payment gateway tak leke jaegi
//     }
//   return (
//     <div>

//         <p>Total:</p>
//         <p>Rs {total}</p>

//         <IconBtn
//             text="Buy Now"
//             onclick={handleBuyCourse}
//             customClasses={"w-full justify-center"}
//         />

//     </div>
//   )
// }

// export default RenderTotalAmount

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import IconBtn from "../../../common/IconBtn";
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyCourse = () => {
    const course_Id = cart.map((course) => course._id);
    console.log("courses Id: ", course_Id);
    buyCourse(token, course_Id, user, navigate, dispatch);
  };

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
