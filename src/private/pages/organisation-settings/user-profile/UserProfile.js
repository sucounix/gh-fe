import React, { useState, useContext, useEffect } from "react";
import {
  Textarea,
  Modal,
  Grid,
  Select,
  TextInput,
  Button,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { rolesData } from "./Roles";
import ChangePassword from "./ChangePassword";
import { UserContext } from "../../../../contexts/UserContext";
import { handleResponseError } from "../../../../utils/errorHandling";
import "./style/UserProfile.scss";
import axios from "axios";
import PhoneInput, {
  isValidPhoneNumber,
} from "react-phone-number-input/mobile";
import "react-phone-number-input/style.css";
import SingleDropdown from "../../../../components/single-level-dropdown/SingleDropdown";
import { Auth } from "aws-amplify";

const UserProfile = () => {
  const [openChangePassModal, setOpenChangePassModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [isNormalAuthenticated, setIsNormalAuthenticated] = useState(false);
  const { user, fetchUser } = useContext(UserContext);

  const form = useForm({
    initialValues: {
      email: user?.email,
      name: user?.name,
      phone_number: user?.phone_number,
      role: "",
      other_role: "",
    },

    validate: (values) => {
      const errors = {};
      if (
        values.phone_number &&
        !isValidPhoneNumber(`${values.phone_number}`)
      ) {
        errors.phone_number = "Phone Number is invalid";
      }

      if (!values.name) errors.name = "Full Name is required";
      else if (!/^[A-Za-z\s]*$/.test(values.name))
        errors.name = "Accepts only alphabet";

      if (values.role && values.role === "other" && !values.other_role)
        errors.other_role = "Role is required";

      return errors;
    },
  });

  useEffect(() => {
    checkIsUserNormalAuthenticated();
  }, []);

  useEffect(() => {
    if (user?.role && !isCustomRole(user?.role)) {
      form.setValues({ role: "other" });
      form.setValues({ other_role: user?.role });
    } else {
      form.setValues({ role: user?.role });
    }
  }, [user]);

  const checkIsUserNormalAuthenticated = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (
        user.signInUserSession.accessToken.payload.scope
          ?.toLowerCase()
          .startsWith("aws")
      ) {
        setIsNormalAuthenticated(true);
      } else {
        setIsNormalAuthenticated(false);
      }
    } catch (error) {
      return error;
    }
  };

  const isCustomRole = (role) => {
    return rolesData.find((item) => {
      return item.value === role;
    });
  };

  const renderChangePassword = () => {
    return (
      <Modal
        opened={openChangePassModal}
        withCloseButton={false}
        onClose={() => setOpenChangePassModal(false)}
        centered
        size="lg"
        radius={"20px"}
        data-testid="change__pass_modal"
      >
        <ChangePassword setOpenChangePassModal={setOpenChangePassModal} />
      </Modal>
    );
  };

  const submitFn = (values) => {
    setloading(true);
    let data = { ...values };
    if (data.role === "other") {
      data.role = data.other_role;
    } else {
      form.setFieldValue("other_role", "");
    }

    delete data.other_role;

    axios
      .patch(`/auth/user/`, data)
      .then((res) => {
        setloading(false);
        notifications.show({
          title: "Success",
          message: "Profile updated successfully",
        });
        fetchUser();
      })
      .catch((err) => {
        setloading(false);
        handleResponseError(err);
      });
  };

  return (
    <div className="user__profile" data-testid="user_profile">
      {renderChangePassword()}
      <div className="div__start">
        <p className="title1">User Profile</p>
        <p className="title2">Review your profile.</p>
      </div>
      <form
        className="user__form"
        onSubmit={form.onSubmit((values) => submitFn(values))}
      >
        <div className="form__container">
          <Flex>
            <div className="single__col">
              <div className="col__content">
                <TextInput
                  label="Email"
                  data-testid="email"
                  disabled
                  className="form__input"
                  {...form.getInputProps("email")}
                />
              </div>
            </div>
            {isNormalAuthenticated && (
              <div className="single__col" data-testid="password_input">
                <div className="change__password__div">
                  <div>
                    <p>Password</p>
                    <p>***********</p>
                  </div>
                  <div>
                    <p
                      className="change__pass"
                      data-testid="change_password_btn"
                      onClick={() => setOpenChangePassModal(true)}
                    >
                      Change Password
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Flex>
          <Flex>
            {" "}
            <div className="single__col">
              <div className="col__content">
                <TextInput
                  className="form__input"
                  withAsterisk
                  label="Full Name"
                  {...form.getInputProps("name")}
                />
              </div>
            </div>
            <div className="single__col">
              <div className="col__content">
                <div className="phone__div">
                  <label className="label__style">Mobile Number</label>
                  <PhoneInput
                    international
                    data-testid="phone_number"
                    {...form.getInputProps("phone_number")}
                    countryCallingCodeEditable={false}
                    defaultCountry="EG"
                    placeholder="Phone number"
                    className="phone__input form__input"
                  />

                  <span className="span__err">
                    {form.errors &&
                      form.errors?.phone_number &&
                      form.errors.phone_number}
                  </span>
                </div>
              </div>
            </div>
          </Flex>
          <Flex>
            {" "}
            <div className="single__col">
              <div className="col__content">
                <SingleDropdown
                  data={rolesData}
                  form={form}
                  title={"Select a role"}
                  field={"role"}
                  data-testid="role"
                  optionLabel={"label"}
                  optionValue={"value"}
                />
              </div>
            </div>
            <div className="single__col">
              <div className="col__content">
                {form.values.role === "other" && (
                  <Textarea
                    className="form__input"
                    {...form.getInputProps("other_role")}
                    label="Other Role"
                    withAsterisk
                  />
                )}
              </div>
            </div>
          </Flex>
        </div>

        <Button
          data-testid="save_btn"
          loading={loading}
          type="submit"
          className="submit__btn"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
