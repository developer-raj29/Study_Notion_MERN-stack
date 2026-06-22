import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import { VscSettingsGear } from "react-icons/vsc";

const Settings = () => {
  return (
    <>
      <h1 className="mb-6 text-3xl font-medium text-richblack-5 flex items-center gap-2">
        <VscSettingsGear className="text-yellow-50" />
        Edit Profile
      </h1>
      {/* Change Profile Picture */}
      <ChangeProfilePicture />
      {/* Profile */}
      <EditProfile />
      {/* Password */}
      <UpdatePassword />
      {/* Delete Account */}
      <DeleteAccount />
    </>
  );
};

export default Settings;
