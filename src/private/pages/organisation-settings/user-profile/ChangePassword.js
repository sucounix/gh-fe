import React, { useContext, useState, useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, PasswordInput } from "@mantine/core";
import { UserContext } from "../../../../contexts/UserContext";
import { handleResponseError } from "../../../../utils/errorHandling";
import { notifications } from "@mantine/notifications";
import { Auth } from "aws-amplify";
import "./style/UserProfile.scss";

const ChangePassword = ({ setOpenChangePassModal }) => {
  const { user, fetchUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      old_password: "",
      new_password1: "",
      new_password2: "",
    },

    validate: (values) => {
      const errors = {};

      if (!values.old_password)
        errors.old_password = "Old Password is required";

      if (!values.new_password1)
        errors.new_password1 = "New Password is required";
      else if (values.new_password1.length < 8) {
        errors.new_password1 = "New Password must be at least 8 characters";
      } else if (values.new_password1 === user?.name) {
        errors.new_password1 = "New Password must not be the same as name";
      }

      if (!values.new_password2)
        errors.new_password2 = "Confirm New Password is required";
      else if (values.new_password2 !== values.new_password1)
        errors.new_password2 = "The two password fields didn’t match";

      return errors;
    },
  });

  const handleResponseSuccess = () => {
    setLoading(false);
    fetchUser();
    setOpenChangePassModal(false);
    notifications.show({
      title: "Success",
      message: "Password updated successfully",
    });
  };

  const handleResError = (err) => {
    form.setErrors(err.message);
    setLoading(false);
    handleResponseError(err, form, err.message);
  };

  const submitFn = (values) => {
    setLoading(true);
    Auth.currentAuthenticatedUser().then((user) => {
      Auth.changePassword(user, values.old_password, values.new_password1)
        .then(() => handleResponseSuccess())
        .catch((err) => handleResError(err));
    });
  };

  return (
    <div className="change__pass__div" data-testid="change__pass__div">
      <p className="title__modal">Change Password</p>
      <p className="text">
        This is a warning message that when you leave this page all the data
        will not be saved
      </p>
      <form
        onSubmit={form.onSubmit((values) => submitFn(values))}
        className="change__pass__form"
        data-testid="changePassword_form"
      >
        <PasswordInput
          label="Old Password"
          withAsterisk
          mb="md"
          data-testid="old_password"
          {...form.getInputProps("old_password")}
          visibilityToggleIcon={({ reveal }) =>
            reveal ? (
              <i class="fa-regular fa-eye-slash"></i>
            ) : (
              <i class="fa-regular fa-eye"></i>
            )
          }
        />
        <PasswordInput
          label="New Password"
          withAsterisk
          mb="md"
          data-testid="new_password"
          {...form.getInputProps("new_password1")}
          visibilityToggleIcon={({ reveal }) =>
            reveal ? (
              <i class="fa-regular fa-eye-slash"></i>
            ) : (
              <i class="fa-regular fa-eye"></i>
            )
          }
        />
        <PasswordInput
          label="Confirm New Password"
          withAsterisk
          mb="md"
          data-testid="confirm_new_password"
          {...form.getInputProps("new_password2")}
          visibilityToggleIcon={({ reveal }) =>
            reveal ? (
              <i class="fa-regular fa-eye-slash"></i>
            ) : (
              <i class="fa-regular fa-eye"></i>
            )
          }
        />
        <div className="btn__group">
          <Button
            variant="outline"
            className="cancel__btn"
            size="lg"
            fullWidth
            onClick={() => {
              setOpenChangePassModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            className="save__btn"
            size="lg"
            data-testid="change_pass_save_btn"
            loading={loading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
