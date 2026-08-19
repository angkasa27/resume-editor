import type { ReactNode } from "react";

import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";

import { academicLayout } from "./layouts/academic/layout";
import { atlasLayout } from "./layouts/atlas/layout";
import { auroraLayout } from "./layouts/aurora/layout";
import { boldTypeLayout } from "./layouts/bold-type/layout";
import { classicLayout } from "./layouts/classic/layout";
import { compassLayout } from "./layouts/compass/layout";
import { crestLayout } from "./layouts/crest/layout";
import { dossierLayout } from "./layouts/dossier/layout";
import { duetLayout } from "./layouts/duet/layout";
import { editorialLayout } from "./layouts/editorial/layout";
import { harvardLayout } from "./layouts/harvard/layout";
import { insetLayout } from "./layouts/inset/layout";
import { ledgerLayout } from "./layouts/ledger/layout";
import { mastheadLayout } from "./layouts/masthead/layout";
import { modernCenteredLayout } from "./layouts/modern-centered/layout";
import { numeralLayout } from "./layouts/numeral/layout";
import { splitLayout } from "./layouts/split/layout";
import { studioLayout } from "./layouts/studio/layout";
import { timelineLayout } from "./layouts/timeline/layout";
import type { PreviewLayoutDefinition } from "./layout-types";
import type { PreviewRenderContext } from "./types";

export const previewLayoutDefinitions = [
  classicLayout,
  modernCenteredLayout,
  timelineLayout,
  academicLayout,
  insetLayout,
  splitLayout,
  duetLayout,
  boldTypeLayout,
  studioLayout,
  auroraLayout,
  ledgerLayout,
  dossierLayout,
  crestLayout,
  mastheadLayout,
  compassLayout,
  numeralLayout,
  atlasLayout,
  editorialLayout,
  harvardLayout,
] as const satisfies ReadonlyArray<PreviewLayoutDefinition>;

// Compile-time guard: the registry must cover `pdfLayoutIds` (the domain SSOT)
// exactly — drift on either side is a type error.
type RegistryId = (typeof previewLayoutDefinitions)[number]["id"];
type AssertEqual<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
const _registryCoversLayoutIds: AssertEqual<RegistryId, PdfLayoutId> = true;
void _registryCoversLayoutIds;

export function getLayout(
  layoutId: PdfLayoutId,
): PreviewLayoutDefinition {
  return (
    previewLayoutDefinitions.find((layout) => layout.id === layoutId) ??
    previewLayoutDefinitions[0]
  );
}

// Single source of truth so canvas live-preview and the exported PDF never
// disagree on whether a layout renders its own Summary heading.
export function shouldHideSummaryHeading(layoutId: PdfLayoutId): boolean {
  return getLayout(layoutId).hideSummaryHeading === true;
}

export function renderLayoutHeader(context: PreviewRenderContext): ReactNode {
  const { Header } = getLayout(context.presentation.layoutId);
  return <Header context={context} />;
}
