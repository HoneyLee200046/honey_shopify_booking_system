import { useTag } from "@jamalsoueidan/bsf.hooks.use-tag";
import { useTranslation } from "@jamalsoueidan/bsf.hooks.use-translation";
import { Select } from "@shopify/polaris";
import { Field } from "@shopify/react-form";
import React from "react";

const locales = {
  da: {
    label: "Tag",
    placeholder: "Vælge tag",
  },
  en: {
    label: "Tag",
    placeholder: "Choose tag",
  },
};

export interface InputTagsProps {
  field: Field<string>;
  label?: string;
  placeholder?: string;
}

export const InputTags = ({ field, label, placeholder }: InputTagsProps) => {
  const { options } = useTag();
  const { t } = useTranslation({ id: "tag-input", locales });

  return (
    <Select label={label || t("label")} placeholder={placeholder || t("placeholder")} options={options} {...field} />
  );
};
