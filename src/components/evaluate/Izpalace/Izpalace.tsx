import React, { useMemo } from "react";
import { IzpalaceProps } from "./Izpalace.type";
import classNames from "classnames";
import "./Izpalace.css";
import { Izstar } from "../Izstar";
import { HeavenlyStemKey, PalaceKey, kot, t } from "iztro/lib/i18n";
import { fixIndex } from "iztro/lib/utils";
import { Scope } from "iztro/lib/data/types";

export const Izpalace = ({
  index,
  taichiPalace,
  focusedIndex,
  onFocused,
  horoscope,
  activeHeavenlyStem,
  toggleActiveHeavenlyStem,
  hoverHeavenlyStem,
  setHoverHeavenlyStem,
  showDecadalScope = false,
  showYearlyScope = false,
  showMonthlyScope = false,
  showDailyScope = false,
  showHourlyScope = false,
  toggleScope,
  toggleTaichiPoint,
  ...palace
}: IzpalaceProps) => {
  const horoscopeMutagens = useMemo(() => {
    if (!horoscope) {
      return [];
    }

    return [
      {
        mutagen: horoscope.decadal.mutagen,
        scope: "decadal" as Scope,
        show: showDecadalScope,
      },
      {
        mutagen: horoscope.yearly.mutagen,
        scope: "yearly" as Scope,
        show: showYearlyScope,
      },
      {
        mutagen: horoscope.monthly.mutagen,
        scope: "monthly" as Scope,
        show: showMonthlyScope,
      },
      {
        mutagen: horoscope.daily.mutagen,
        scope: "daily" as Scope,
        show: showDailyScope,
      },
      {
        mutagen: horoscope.hourly.mutagen,
        scope: "hourly" as Scope,
        show: showHourlyScope,
      },
    ];
  }, [
    horoscope,
    showDecadalScope,
    showYearlyScope,
    showMonthlyScope,
    showDailyScope,
    showHourlyScope,
  ]);

  return (
    <div
      className={classNames("iztro-palace", {
        "focused-palace": focusedIndex === index,
        "opposite-palace":
          focusedIndex != undefined && index === fixIndex(focusedIndex + 6),
        "surrounded-palace":
          focusedIndex != undefined &&
          (index === fixIndex(focusedIndex + 4) ||
            index === fixIndex(focusedIndex - 4)),
      })}
      style={{ gridArea: `g${index}` }}
      onMouseEnter={() => onFocused?.(index)}
      onMouseLeave={() => onFocused?.(undefined)}
    >
      {/* Vị trí hiện tại: top, left */}
      <div
        className={classNames("iztro-palace-gz", {
          "iztro-palace-gz-active":
            activeHeavenlyStem ===
            kot<HeavenlyStemKey>(palace.heavenlyStem, "Heavenly"),
        })}
        onClick={() =>
          toggleActiveHeavenlyStem?.(
            kot<HeavenlyStemKey>(palace.heavenlyStem, "Heavenly")
          )
        }
        onMouseEnter={() =>
          setHoverHeavenlyStem?.(
            kot<HeavenlyStemKey>(palace.heavenlyStem, "Heavenly")
          )
        }
        onMouseLeave={() => setHoverHeavenlyStem?.(undefined)}
      >
        <span
          className={classNames({
            "iztro-palace-gz-active":
              activeHeavenlyStem ===
              kot<HeavenlyStemKey>(palace.heavenlyStem, "Heavenly"),
          })}
        >
          {palace.heavenlyStem}&nbsp;
          {palace.earthlyBranch}
        </span>
      </div>

      {/* vị trí hiện tại: top, horizontal center */}
      <div className={classNames("iztro-palace-minor mt-10 w-[130%]")}>
        {palace.majorStars.map((star) => (
          <Izstar
            key={star.name}
            activeHeavenlyStem={activeHeavenlyStem}
            hoverHeavenlyStem={hoverHeavenlyStem}
            palaceHeavenlyStem={kot<HeavenlyStemKey>(
              palace.heavenlyStem,
              "Heavenly"
            )}
            horoscopeMutagens={horoscopeMutagens}
            {...star}
          />
        ))}
      </div>

      {/* Vị trí hiện tại: top, horizontal center */}
      <div className={classNames("iztro-palace-minor")}>
        <span className="iztro-palace-name-wrapper">
          {palace.name}
          <span className="iztro-palace-name-taichi">
            {taichiPalace &&
              (kot<PalaceKey>(taichiPalace) === kot<PalaceKey>("命宫")
                ? "☯"
                : taichiPalace)}
          </span>
        </span>
      </div>

      {/* Vị trí hiện tại: top, right */}
      <div className={classNames("iztro-palace-adj")}>
        {/*  */}
        <div className={classNames("iztro-palace-scope")}>
          <div className={classNames("iztro-palace-scope-decadal")}>
            {palace.decadal.range[0]}
          </div>
        </div>
      </div>

      {/* Vị trí hiện tại: left, vertical center */}
      <div className={classNames("iztro-palace-horo-star")}>
        {/* <div className={classNames("stars")}>
          {horoscope?.yearly?.stars &&
            horoscope?.yearly?.stars[index].map((star) => (
              <Izstar key={star.name} {...star} />
            ))}
        </div> */}
        <div>
          {/* toàn bộ cái này là danh sách sao */}
          {palace.adjectiveStars.slice(5).map((star) => (
            <Izstar key={star.name} {...star} />
          ))}

          <div>{palace.boshi12}</div>

          <div className={classNames("iztro-palace-lft24")}>
            <div>
              {showYearlyScope
                ? horoscope?.yearly.yearlyDecStar.suiqian12[index]
                : palace.suiqian12}
            </div>

            <div>
              {showYearlyScope
                ? horoscope?.yearly.yearlyDecStar.jiangqian12[index]
                : palace.jiangqian12}
            </div>
          </div>

          <div className={classNames("iztro-palace-lft24")}>
            {palace.minorStars.map((star) => (
              <Izstar
                key={star.name}
                activeHeavenlyStem={activeHeavenlyStem}
                hoverHeavenlyStem={hoverHeavenlyStem}
                palaceHeavenlyStem={kot<HeavenlyStemKey>(
                  palace.heavenlyStem,
                  "Heavenly"
                )}
                horoscopeMutagens={horoscopeMutagens}
                {...star}
              />
            ))}
          </div>
        </div>

        <div>
          {palace.adjectiveStars.slice(0, 5).map((star) => (
            <Izstar key={star.name} {...star} />
          ))}
        </div>
      </div>

      {/* ---------------footer--------------- */}
      <div className={classNames("iztro-palace-footer")}>
        <div>
          {/* Vị trí hiện tại: bottom, left */}
          <div className={classNames("iztro-palace-lft24")}>
            {/* <div>{palace.changsheng12}</div>
            <div>{palace.boshi12}</div> */}
          </div>

          <div
            className={classNames("iztro-palace-name")}
            onClick={() => toggleTaichiPoint?.(index)}
          >
            {palace.isBodyPalace && (
              <span className={classNames("iztro-palace-name-body")}>
                ·{t("bodyPalace")}
              </span>
            )}
          </div>
        </div>

        {/* Vị trí hiện tại: bottom, horizontal center */}
        <div>
          <div className={classNames("iztro-palace-footer-center")}>
            <div>{palace.changsheng12}</div>
          </div>

          <div
            className={classNames("iztro-palace-name")}
            onClick={() => toggleTaichiPoint?.(index)}
          >
            {palace.isBodyPalace && (
              <span className={classNames("iztro-palace-name-body")}>
                ·{t("bodyPalace")}
              </span>
            )}
          </div>
        </div>

        {/* Vị trí hiện tại: bottom, right */}
        <div>
          <div className={classNames("iztro-palace-major")}></div>
        </div>
      </div>
    </div>
  );
};
