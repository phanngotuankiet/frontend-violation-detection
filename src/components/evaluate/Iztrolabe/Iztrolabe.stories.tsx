import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { IztrolabeNaikyo as IztroAstrolabe } from "./Iztrolabe";
import { IztrolabeProps } from "./Iztrolabe.type";

const meta: Meta<typeof IztroAstrolabe> = {
  component: IztroAstrolabe,
  argTypes: {
    birthday: { type: "string", required: true },
    birthTime: {
      type: "number",
      control: {
        type: "select",
        labels: {
          0: "Giờ Tý sớm (00:00~01:00)",
          1: "Giờ Sửu (01:00~03:00)", 
          2: "Giờ Dần (03:00~05:00)",
          3: "Giờ Mão (05:00~07:00)",
          4: "Giờ Thìn (07:00~09:00)",
          5: "Giờ Tỵ (09:00~11:00)",
          6: "Giờ Ngọ (11:00~13:00)",
          7: "Giờ Mùi (13:00~15:00)",
          8: "Giờ Thân (15:00~17:00)",
          9: "Giờ Dậu (17:00~19:00)",
          10: "Giờ Tuất (19:00~21:00)",
          11: "Giờ Hợi (21:00~23:00)",
          12: "Giờ Tý muộn (23:00~00:00)",
        },
      },
      min: 0,
      max: 12,
      reqired: true,
      options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    gender: {
      type: "string",
      control: "inline-radio",
      options: ["male", "female"],
      required: true,
    },
    birthdayType: {
      type: "string",
      control: "inline-radio",
      options: ["lunar", "solar"],
    },
    isLeapMonth: { type: "boolean", if: { arg: "birthdayType", eq: "lunar" } },
    fixLeap: { type: "boolean" },
    lang: {
      type: "string",
      control: {
        type: "select",
        labels: {
          0: "简体中文",
          1: "繁体中文",
          2: "日语",
          3: "韩语",
          4: "英语",
          5: "越南语",
        },
      },
      options: ["zh-CN", "zh-TW", "ja-JP", "ko-KR", "en-US", "vi-VN"],
    },
    centerPalaceAlign: {
      type: "boolean",
      description: "中宫居中对齐",
      defaultValue: false,
      control: {
        type: "boolean",
        labels: {
          true: "居中",
          false: "默认",
        },
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof IztroAstrolabe>;

export const Iztrolabe: Story = (args: IztrolabeProps) => (
  <div style={{ height: "100vh" }}>
    <IztroAstrolabe
      {...args}
      horoscopeDate={
        args.horoscopeDate ? new Date(args.horoscopeDate) : undefined
      }
    />
  </div>
);

Iztrolabe.args = {
  birthday: "2023-9-4",
  birthTime: 0,
  gender: "female",
  birthdayType: "solar",
  isLeapMonth: false,
  fixLeap: true,
  options: {
    yearDivide: "exact",
  },
};
