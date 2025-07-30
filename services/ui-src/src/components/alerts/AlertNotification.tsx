import React from "react";
import { Alert } from "@cmsgov/design-system";
import { AlertVariation } from "@cmsgov/design-system/dist/types/Alert/Alert";

interface Props {
  title: string;
  description: string;
  variation: AlertVariation;
}

export const AlertNotification: React.FC<Props> = ({
  title,
  description,
  variation,
}) => {
  return (
    <Alert variation={variation} heading={title}>
      {description}
    </Alert>
  );
};
