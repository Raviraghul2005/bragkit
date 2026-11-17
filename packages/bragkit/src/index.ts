// bragkit: the collection. Every exhibit and primitive is a named export, and each exhibit
// is also its own entry (bragkit/now-playing), so bundlers only ship what you import.
// Styles: import "bragkit/styles.css" once.

export type { BaseProps, BragStyle, Size, Theme, Tone, ToneProps } from "./internal/base";
export type { ExhibitMeta, PropSpec, Wing } from "./internal/meta";

// Primitives
export { Case, Placard, Plinth, Hang, Medal, LiveDot } from "./primitives/index";
export type { CaseProps, PlacardProps, PlinthProps, HangProps, MedalProps, LiveDotProps } from "./primitives/index";
export { BrassPlate } from "./primitives/BrassPlate";
export type { BrassPlateProps } from "./primitives/BrassPlate";

// Exhibits
export { NowPlaying } from "./exhibits/now-playing/NowPlaying";
export type { NowPlayingProps } from "./exhibits/now-playing/NowPlaying";
export { ShippingStreak } from "./exhibits/shipping-streak/ShippingStreak";
export type { ShippingStreakProps } from "./exhibits/shipping-streak/ShippingStreak";
export { LocalTime } from "./exhibits/local-time/LocalTime";
export type { LocalTimeProps } from "./exhibits/local-time/LocalTime";
export { StatusCard } from "./exhibits/status-card/StatusCard";
export type { StatusCardProps } from "./exhibits/status-card/StatusCard";
export { TechStack, TechKeyboard } from "./exhibits/tech-stack/TechStack";
export type { TechStackProps, TechKeyboardProps, TechItem, Logo } from "./exhibits/tech-stack/TechStack";
export { OpenForWork } from "./exhibits/open-for-work/OpenForWork";
export type { OpenForWorkProps } from "./exhibits/open-for-work/OpenForWork";
export { ContributionTapestry } from "./exhibits/contribution-tapestry/ContributionTapestry";
export type { ContributionTapestryProps, Contribution } from "./exhibits/contribution-tapestry/ContributionTapestry";
export { TrophyCase } from "./exhibits/trophy-case/TrophyCase";
export type { TrophyCaseProps, Pin, PinIcon, PinShape } from "./exhibits/trophy-case/TrophyCase";
export { StatsPlaque } from "./exhibits/stats-plaque/StatsPlaque";
export type { StatsPlaqueProps, Stat } from "./exhibits/stats-plaque/StatsPlaque";
export { CallingCards } from "./exhibits/calling-cards/CallingCards";
export type { CallingCardsProps, CallingCard } from "./exhibits/calling-cards/CallingCards";
export { Signature } from "./exhibits/signature/Signature";
export type { SignatureProps } from "./exhibits/signature/Signature";
export { VisitorsBook } from "./exhibits/visitors-book/VisitorsBook";
export type { VisitorsBookProps, BookEntry } from "./exhibits/visitors-book/VisitorsBook";
export { HeadCount } from "./exhibits/head-count/HeadCount";
export type { HeadCountProps } from "./exhibits/head-count/HeadCount";
export { DaysSince } from "./exhibits/days-since/DaysSince";
export type { DaysSinceProps } from "./exhibits/days-since/DaysSince";
export { Postcard } from "./exhibits/postcard/Postcard";
export type { PostcardProps } from "./exhibits/postcard/Postcard";
export { PinnedRepo } from "./exhibits/pinned-repo/PinnedRepo";
export type { PinnedRepoProps } from "./exhibits/pinned-repo/PinnedRepo";
export { ShipLog } from "./exhibits/ship-log/ShipLog";
export type { ShipLogProps, ShipLogEntry } from "./exhibits/ship-log/ShipLog";
export { CodingToday } from "./exhibits/coding-today/CodingToday";
export type { CodingTodayProps, CodingLanguage } from "./exhibits/coding-today/CodingToday";
export { CurrentlyReading } from "./exhibits/currently-reading/CurrentlyReading";
export type { CurrentlyReadingProps } from "./exhibits/currently-reading/CurrentlyReading";
export { PolaroidStack } from "./exhibits/polaroid-stack/PolaroidStack";
export type { PolaroidStackProps, Polaroid } from "./exhibits/polaroid-stack/PolaroidStack";
export { DeskSetup } from "./exhibits/desk-setup/DeskSetup";
export type { DeskSetupProps, DeskItem, DeskKind } from "./exhibits/desk-setup/DeskSetup";
// @exhibits-end


export const version = "0.2.0";
