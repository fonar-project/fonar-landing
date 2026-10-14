import "./fontes";
import React from "react";
import { Composition, Folder } from "remotion";
import { CENAS, DURACAO_TOTAL } from "./linhaDoTempo";
import { COMPONENTES, FonarBanca } from "./FonarBanca";
import { FPS } from "./tema";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FonarBanca" component={FonarBanca} width={1920} height={1080} fps={FPS} durationInFrames={DURACAO_TOTAL} />
    <Folder name="Cenas">
      {CENAS.map((c) => (
        <Composition key={c.id} id={c.id} component={COMPONENTES[c.id]} width={1920} height={1080} fps={FPS} durationInFrames={c.dur} />
      ))}
    </Folder>
  </>
);
