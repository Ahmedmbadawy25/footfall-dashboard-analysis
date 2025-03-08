import { MdLock } from "react-icons/md";
import Card from "components/card";
import React, { useState } from "react";
import { makeRequest } from "fetcher";
import NotificationHandler from "components/Notification";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNotification, setShowNotificatoin] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
        // setError("Passwords do not match.");
        return;
    }

    try {
        const response = await makeRequest( "POST", "/api/auth/changepassword",{ newPassword: formData.newPassword });
        if (response.status === '200') {
            setFormData({ newPassword: "", confirmPassword: "",})
            setShowNotificatoin(true)
            setTimeout(() => setShowNotificatoin(false), 3000);
        }
        else {
            throw new Error(response.message || "Something went wrong");
        }

        // setSuccess("Password updated successfully.");
        // setError("");
    } catch (error) {
        // setError(error.message);
    }
  };

  return (
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
        {showNotification && <NotificationHandler status='success' message='Password Updated Successfully' /> }
      <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6 flex flex-col items-center justify-center">
        <MdLock className="text-[80px] text-brand-500 dark:text-white" />
        <h4 className="text-xl font-bold text-brand-500 dark:text-white">
          Change Password
        </h4>
        <p className="mt-2 text-sm font-medium text-gray-600 text-center">
          Ensure your account security by updating your password.
        </p>
      </div>

      <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white p-3 dark:!bg-navy-800">
        <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
          Update Your Password
        </h5>
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-brand-500 focus:outline-none dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            onChange={handleChange}
            value={formData?.newPassword}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-brand-500 focus:outline-none dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            onChange={handleChange}
            value={formData?.confirmPassword}
            required
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:bg-navy-900 dark:hover:bg-white/20"
          >
            Update Password
          </button>
        </form>
      </div>
    </Card>
  );
};

export default ChangePassword;
