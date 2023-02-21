import { Schedule } from "@jamalsoueidan/bsb.types.schedule";
import { Tag } from "@jamalsoueidan/bsb.types.tag";
import { ApplicationFramePage } from "@jamalsoueidan/bsd.preview.application";
import { useToast } from "@jamalsoueidan/bsf.hooks.use-toast";
import { Card } from "@shopify/polaris";
import React, { useCallback, useRef, useState } from "react";
import {
  EditOneShift,
  EditOneShiftBody,
  EditOneShiftRefMethod,
  EditOneShiftSubmitResult,
} from "./edit-one-shift";

const schedule: Schedule = {
  _id: "63f3b18f4707a16914cc9e95",
  end: new Date("2023-02-21T13:00:00.000Z"),
  shop: "testeriphone.myshopify.com",
  staff: "63f3a8e90a05d212213e8781",
  start: new Date("2023-02-21T08:00:00.000Z"),
  tag: Tag.all_day,
};

const MockComponent = () => {
  const ref = useRef<EditOneShiftRefMethod>(null);
  const { show } = useToast();
  const [body, setBody] = useState({});

  const onSubmit = useCallback(
    (fieldValues: EditOneShiftBody): EditOneShiftSubmitResult => {
      setBody(fieldValues);
      show({ content: "Schedules created" });
      return {
        status: "success",
      };
    },
    [show],
  );

  const submit = useCallback(() => {
    ref?.current?.submit();
  }, [ref]);

  return (
    <Card
      sectioned
      primaryFooterAction={{ content: "Submit", onAction: submit }}
    >
      <EditOneShift schedule={schedule} onSubmit={onSubmit} ref={ref} />

      <div>
        <pre>{JSON.stringify(body, null, 2)}</pre>
      </div>
    </Card>
  );
};

export const BasicEditOneShift = () => (
  <ApplicationFramePage title="Edit one shift">
    <MockComponent />
  </ApplicationFramePage>
);
