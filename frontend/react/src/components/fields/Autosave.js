import React from "react";
import { Button } from "@cmsgov/design-system-core";

const Autosave = () => (
  <div className="autosave">
    <div className="ds-l-row">
      <div className="ds-l-col">
        <Button
          className="ds-c-button--transparent"
          title="Last edited 3 minutes ago"
          disabled
        >
          All changes auto-saved
        </Button>
      </div>
    </div>
  </div>
);

export default Autosave;
