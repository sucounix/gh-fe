import React, { useState, useContext } from "react";
import { Button, Checkbox, Flex, Modal } from "@mantine/core";
import TermsOfServiceContent from "../../../public/components/terms-of-service/TermsOfServiceContent";
import "../../../public/components/auth-footer/style/AuthFooter.scss";
import { handleResponseError } from "../../../utils/errorHandling";
import axios from "axios";
import { UserContext } from "../../../contexts/UserContext";
function TOSModalConfirm({ showToS, handleHideTOSModal }) {
  const { setUser } = useContext(UserContext);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUserUpdate = () => {
    setLoading(true);
    axios
      .patch(`/auth/user/`, { is_terms_accepted: true })
      .then((res) => {
        handleHideTOSModal();
        setUser(res.data);
      })
      .catch((err) => {
        handleResponseError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Modal
      size={"xl"}
      opened={showToS}
      centered
      transitionProps={{ timeout: 500 }}
      radius={15}
      withCloseButton={false}
      closeOnClickOutside={false}
      data-testid="tos_modal_confirm"
    >
      <div className="tos__modal">
        <div className="tos__modal__title"> Terms and Conditions</div>
        <div className="tos__modal__content">
          <TermsOfServiceContent />
        </div>
        <div className="tos__modal__footer">
          <Checkbox
            checked={isChecked}
            data-testid="read_TOS"
            label="I have read and accept all  the term and condition above"
            onChange={(event) => setIsChecked(event.currentTarget.checked)}
          />
          <Flex justify={"center"} mt={8}>
            <Button
              size="md"
              onClick={handleUserUpdate}
              disabled={!isChecked}
              loading={loading}
              data-testid="agree_TOS_btn"
            >
              <span className="done">Done</span>
            </Button>
          </Flex>
        </div>
      </div>
    </Modal>
  );
}
export default TOSModalConfirm;
