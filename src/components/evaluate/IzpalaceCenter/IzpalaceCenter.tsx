import classNames from "classnames";
import React, { useMemo } from "react";
import FunctionalAstrolabe from "iztro/lib/astro/FunctionalAstrolabe";
import { Item, ItemProps } from "./Item";
import "./IzpalaceCenter.css";
import { Line } from "./Line";
import { fixEarthlyBranchIndex } from "iztro/lib/utils";
import { Scope } from "iztro/lib/data/types";
import { IFunctionalHoroscope } from "iztro/lib/astro/FunctionalHoroscope";
import { GenderName, kot } from "iztro/lib/i18n";

type IzpalaceCenterProps = {
  astrolabe?: FunctionalAstrolabe;
  horoscope?: IFunctionalHoroscope;
  horoscopeDate?: string | Date;
  horoscopeHour?: number;
  arrowIndex?: number;
  arrowScope?: Scope;
  setHoroscopeDate?: React.Dispatch<
    React.SetStateAction<string | Date | undefined>
  >;
  setHoroscopeHour?: React.Dispatch<React.SetStateAction<number | undefined>>;
  centerPalaceAlign?: boolean;
};

export const IzpalaceCenter = ({
  astrolabe,
  horoscope,
  arrowIndex,
  arrowScope,
  centerPalaceAlign,
}: IzpalaceCenterProps) => {
  const records: ItemProps[] = useMemo(
    () => [
      {
        title: "Ngũ hành cục: ",
        content: astrolabe?.fiveElementsClass,
      },
      {
        title: "Tuổi (âm lịch): ",
        content: `${horoscope?.age.nominalAge} tuổi`,
      },
      {
        title: "Tứ trụ: ",
        content: astrolabe?.chineseDate,
      },
      {
        title: "Ngày sinh dương lịch: ",
        content: astrolabe?.solarDate,
      },
      {
        title: "Ngày sinh âm lịch: ",
        content: astrolabe?.lunarDate,
      },
      {
        title: "Giờ: ",
        content: `${astrolabe?.time}(${astrolabe?.timeRange})`,
      },
      {
        title: "Con giáp: ",
        content: astrolabe?.zodiac,
      },
      {
        title: "Cung hoàng đạo: ",
        content: astrolabe?.sign,
      },
      {
        title: "Mệnh chủ: ",
        content: astrolabe?.soul,
      },
      {
        title: "Thân chủ: ",
        content: astrolabe?.body,
      },
      {
        title: "Cung mệnh: ",
        content: astrolabe?.earthlyBranchOfSoulPalace,
      },
      {
        title: "Cung thân: ",
        content: astrolabe?.earthlyBranchOfBodyPalace,
      },
    ],
    [astrolabe, horoscope]
  );

  return (
    <div
      className={classNames("iztro-center-palace", {
        "iztro-center-palace-centralize": centerPalaceAlign,
      })}
    >
      {astrolabe?.earthlyBranchOfSoulPalace && (
        <Line
          scope={arrowScope}
          index={
            arrowIndex ??
            fixEarthlyBranchIndex(astrolabe.earthlyBranchOfSoulPalace)
          }
        />
      )}
      <h3 className="center-title">
        <span
          className={`gender gender-${kot<GenderName>(
            astrolabe?.gender ?? ""
          )}`}
        >
          {kot<GenderName>(astrolabe?.gender ?? "") === "male" ? "♂" : "♀"}
        </span>
        <span>Thông tin cơ bản</span>
      </h3>
      <ul className="basic-info">
        {records.map((rec, idx) => (
          <Item key={idx} {...rec} />
        ))}
      </ul>
      {/* <h3 className="center-title">Thông tin vận hạn</h3>
      <ul className="basic-info">
        <Item title="Âm lịch：" content={horoDate.lunar} />
        <div
          className={classNames("solar-horoscope", {
            "solar-horoscope-centralize": centerPalaceAlign,
          })}
        >
          <Item title="Dương lịch：" content={horoDate.solar} />
          <span
            className="today"
            onClick={() => setHoroscopeDate?.(new Date())}
          >
            Hôm nay
          </span>
        </div>
      </ul>
      <div className="horo-buttons">
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "yearly", -10),
          })}
          onClick={() => onHoroscopeButtonClicked("yearly", -10)}
        >
          ◀Đại hạn
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "yearly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("yearly", -1)}
        >
          ◀Năm
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "monthly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("monthly", -1)}
        >
          ◀Tháng
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "daily", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("daily", -1)}
        >
          ◀Ngày
        </span>
        <span
          className={classNames("center-button", {
            disabled: shouldBeDisabled(horoDate.solar, "hourly", -1),
          })}
          onClick={() => onHoroscopeButtonClicked("hourly", -1)}
        >
          ◀Giờ
        </span>
        <span className="center-horo-hour">
          {t(CHINESE_TIME[horoscopeHour])}
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("hourly", 1)}
        >
          Giờ▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("daily", 1)}
        >
          Ngày▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("monthly", 1)}
        >
          Tháng▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("yearly", 1)}
        >
          Năm▶
        </span>
        <span
          className={classNames("center-button")}
          onClick={() => onHoroscopeButtonClicked("yearly", 10)}
        >
          Đại hạn▶
        </span>
      </div>
      <a
        className="iztro-copyright"
        href="https://github.com/sylarlong/iztro"
        target="_blank"
      >
        <i>
          Được phát triển bởi <code>iztro</code>
        </i>
      </a> */}
    </div>
  );
};
