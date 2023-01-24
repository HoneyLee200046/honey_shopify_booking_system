import { ApplicationFramePage } from "@jamalsoueidan/bsd.preview.application";
import { Card, Range, Text } from "@shopify/polaris";
import { useField } from "@shopify/react-form";
import { addDays, eachDayOfInterval, format } from "date-fns";
import React, { useCallback } from "react";
import { InputDate } from "./input-date";
import { useState } from "react";

export const Basic = () => {
  const [date, setDate] = useState<Range | undefined>(undefined);
  const field = useField(undefined);

  const onMonthChange = useCallback(
    (value: Range) => {
      setDate(value);
    },
    [setDate]
  );

  return (
    <ApplicationFramePage>
      <Card title="Normal mode" sectioned>
        <InputDate {...field} onMonthChange={onMonthChange} />
        <Text variant="bodyMd" as="p">
          {field.value ? format(field.value, "PPP") : ""}
        </Text>
        <div>
          <pre>{JSON.stringify(date || {}, null, 2)}</pre>
        </div>
      </Card>
    </ApplicationFramePage>
  );
};

export const Inline = () => {
  const field = useField(undefined);

  return (
    <ApplicationFramePage>
      <Card title="Inline mode" sectioned>
        <InputDate mode="inline" {...field} />
        <Text variant="bodyMd" as="p">
          {field.value ? format(field.value, "PPP") : ""}
        </Text>
      </Card>
    </ApplicationFramePage>
  );
};

export const LabelHidden = () => {
  const field = useField(undefined);

  return (
    <ApplicationFramePage>
      <Card title="Inline mode" sectioned>
        <InputDate mode="inline" labelHidden={true} {...field} />
        <Text variant="bodyMd" as="p">
          {field.value ? format(field.value, "PPP") : ""}
        </Text>
      </Card>
    </ApplicationFramePage>
  );
};

export const WithData = () => {
  const field = useField(undefined);

  return (
    <ApplicationFramePage>
      <Card title="Inline mode with data" sectioned>
        <InputDate mode="inline" data={mock} {...field} />
        <Text variant="bodyMd" as="p">
          {field.value ? format(field.value, "PPP") : ""}
        </Text>
      </Card>
    </ApplicationFramePage>
  );
};

const result = eachDayOfInterval({
  start: addDays(new Date(), 2),
  end: addDays(new Date(), 4),
});

const mock = result.map((r) => ({
  date: r.toJSON(),
  hours: [],
}));
