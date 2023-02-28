import { faker } from "@faker-js/faker";
import { StaffRole } from "@jamalsoueidan/bsb.types.staff";
import { withApplication } from "@jamalsoueidan/bsd.preview.with-application";
import { Select } from "@shopify/polaris";
import { useField } from "@shopify/react-form";
import React, { useMemo } from "react";
import { Can } from "./ability-context";
import { AbilityProvider } from "./ability-context-provider";
import { defineAbilityFor } from "./ability-context.define";

const staff = {
  _id: "1",
  active: true,
  address: "asdiojdsajioadsoji",
  avatar: "http://",
  email: faker.internet.email(),
  fullname: faker.name.fullName(),
  group: "test",
  language: "da",
  password: "12345678",
  phone: "+4531317411",
  position: "2",
  postal: 8000,
  role: StaffRole.user,
  shop: "dontmatter",
  timeZone: "Europe/Copenhagen",
};

const MockComponent = () => (
  <>
    <strong>Can I create Product?:</strong>
    <Can I="create" a="product" passThrough>
      {(can) => (can ? "yes" : "no")}
    </Can>
    <br />
    <strong>Can I update Product?:</strong>
    <Can I="update" a="product" passThrough>
      {(can) => (can ? "yes" : "no")}
    </Can>
    <br />
    <strong>Can I create Staff?:</strong>
    <Can I="create" a="staff" this={staff} passThrough>
      {(can) => (can ? "yes" : "no")}
    </Can>
    <br />
    <strong>Can I update Staff?:</strong>
    <Can I="update" a="staff" this={staff} passThrough>
      {(can) => (can ? "yes" : "no")}
    </Can>
  </>
);

export const BasicThemeUsage = withApplication(
  () => {
    const role = useField<StaffRole>(StaffRole.admin);
    const ability = defineAbilityFor({
      isAdmin: role.value === StaffRole.admin,
      isOwner: role.value === StaffRole.owner,
      isUser: role.value === StaffRole.user,
      staff: "1",
    });

    const roleOptions = useMemo(
      () =>
        Object.entries(StaffRole)
          .filter(([, value]) => !Number.isNaN(Number(value)))
          .map(([label, value]) => ({
            label,
            value: value.toString(),
          })),
      [],
    );

    return (
      <>
        I am logged in as {StaffRole[role.value]} <br />
        <AbilityProvider ability={ability}>
          <MockComponent />
        </AbilityProvider>
        <Select
          label="Role"
          options={roleOptions}
          value={role.value.toString()}
          onChange={(value) => role.onChange(parseInt(value, 10))}
        />
      </>
    );
  },
  { pageTitle: "Ability" },
);
