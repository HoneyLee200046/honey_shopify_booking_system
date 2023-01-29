import {
  WithTimerFieldType,
  WithTimerProps,
  WithTimerStrictOption,
  withTimer,
} from "@jamalsoueidan/bsf.hocs.with-timer";
import { useTranslation } from "@jamalsoueidan/bsf.hooks.use-translation";
import { AlphaStack, Button, Columns, Inline, Labelled, Text } from "@shopify/polaris";
import { format, setHours } from "date-fns";
import React, { memo } from "react";

export type InputTimerDividerFieldType = WithTimerFieldType;
export type InputTimerDividerProps = WithTimerProps;

export const InputTimerDivider = withTimer(({ field, input }) => {
  const { t } = useTranslation({ id: "input-timer-list", locales });

  const options = input?.options;
  const morning = options?.filter((f) => parseInt(format(new Date(f.value), "k"), 10) < 12) || [];

  const afternoon =
    options?.filter((f) => {
      const hour = parseInt(format(new Date(f.value), "k"), 10);
      return hour > 12 && hour < 18;
    }) || [];

  const evening =
    options?.filter((f) => {
      const hour = parseInt(format(new Date(f.value), "k"), 10);
      return hour > 18;
    }) || [];

  return (
    <Labelled id="input-timer" label={input?.label || t("label")} {...input} error={field.error}>
      {options?.length === 0 ? (
        t("empty")
      ) : (
        <Columns columns={{ sm: 3, xs: 1 }}>
          <ColumnPeriod
            date={setHours(new Date(), 11)}
            hours={morning}
            onChange={input?.onChange}
            selected={field.value?.start}
          />
          <ColumnPeriod
            date={setHours(new Date(), 13)}
            hours={afternoon}
            onChange={input?.onChange}
            selected={field.value?.start}
          />
          <ColumnPeriod
            date={setHours(new Date(), 19)}
            hours={evening}
            onChange={input?.onChange}
            selected={field.value?.start}
          />
        </Columns>
      )}
    </Labelled>
  );
});

interface ColumnPeriodProps {
  date: Date;
  hours: WithTimerStrictOption[];
  onChange?: (selected: string, id: string) => void;
  selected?: string;
}

const ColumnPeriod = memo(({ date, hours, onChange, selected }: ColumnPeriodProps) => {
  const { t } = useTranslation({
    id: "column-period",
    locales: {
      da: {
        ...locales.da.inline,
      },
      en: {
        ...locales.en.inline,
      },
    },
  });

  return (
    <AlphaStack gap="1" fullWidth>
      <Text variant="headingSm" as="p" alignment="center">
        {format(date, "B")}
      </Text>
      {hours.length === 0 ? (
        <Text variant="bodyMd" as="span" alignment="center">
          {t("empty")}
        </Text>
      ) : (
        hours.map((m) => (
          <InlineButtonHour
            key={m.value}
            onClick={() => onChange && onChange(m.value, m.label)}
            label={m.label}
            pressed={m.value === selected}
          />
        ))
      )}
    </AlphaStack>
  );
});

interface InlineButtonHourProps {
  label: string;
  onClick: () => void;
  pressed: boolean;
}

const InlineButtonHour = memo(({ label, onClick, pressed }: InlineButtonHourProps) => (
  <Inline align="center">
    <Button size="slim" onClick={onClick} pressed={pressed}>
      {label}
    </Button>
  </Inline>
));

const locales = {
  da: {
    empty: "Der findes ingen tidspunkter",
    inline: {
      empty: "Ingen tidspunkter",
    },
    label: "Vælg tid",
  },
  en: {
    empty: "There is no time available",
    inline: {
      empty: "No time",
    },
    label: "Choose time",
  },
};