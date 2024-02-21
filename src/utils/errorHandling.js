/* istanbul ignore file */
import { notifications } from "@mantine/notifications";
import { ReachedYourPlanMax } from "../components/modals/reached-your-plan-max/ReachedYourPlanMax";

export const handleResponseError = (axiosError = {}, form, externalError) => {
  if (axiosError.response) {
    if (axiosError.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
      return;
    }
    if (axiosError.response.status === 404) {
      localStorage.removeItem(`selectedCompanyId`);
      window.location.replace("/");
      return;
    }
    if (axiosError.response.status === 403) {
      if (
        axiosError.response.data.detail ===
        "You have reached to the max limit. please upgrade your subscription plan."
      ) {
        ReachedYourPlanMax();
      }
    }

    let errors = axiosError?.response?.data;
    if (errors.detail) {
      // If only detail is returned, then show it on a toast
      notifications.show({
        title: "Error",
        color: "red",
        message: errors.detail,
      });
    } else if (errors.non_field_errors) {
      // If only non_field_errors is returned, then show it on a toast
      notifications.show({
        title: "Error",
        color: "red",
        message: errors.non_field_errors[0],
      });
    } else {
      // If more than one error is returned, then show them on the form
      if (errors) {
        if (form) {
          Object.keys(errors).forEach((key) => {
            form.setFieldError(key, errors[key][0]);
          });
        } else {
          // Send Toast with internal server error
        }
      }
    }
  } else if (axiosError.request) {
    // The request was made but no response was received
  } else if (externalError) {
    notifications.show({
      title: "Error",
      color: "red",
      message: externalError,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
  }
};
